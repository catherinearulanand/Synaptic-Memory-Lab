import { VOCAB_SIZE } from './types';
import type { Demonstration, DynamicsParams, LatentStepResult, QueryTrace, SymbolIndex, SynapseMatrix } from './types';

export function createEmptyState(): SynapseMatrix {
  return Array.from({ length: VOCAB_SIZE }, () => new Array<number>(VOCAB_SIZE).fill(0));
}

/**
 * One Hebbian write: strengthen the demonstrated (x, y) synapse, decay every other
 * synapse (models plasticity/forgetting), then clip to non-negative. The matrix
 * stays VOCAB_SIZE x VOCAB_SIZE no matter how many demonstrations have been applied.
 */
export function hebbianUpdate(state: SynapseMatrix, demo: Demonstration, plasticity: number, decay: number): SynapseMatrix {
  const next = state.map((row) => row.map((value) => Math.max(0, value * (1 - decay))));
  next[demo.x][demo.y] += plasticity;
  return next;
}

export function applyDemonstrations(demonstrations: Demonstration[], plasticity: number, decay: number): SynapseMatrix {
  let state = createEmptyState();
  for (const demo of demonstrations) {
    state = hebbianUpdate(state, demo, plasticity, decay);
  }
  return state;
}

export function oneHot(index: SymbolIndex): number[] {
  const vec = new Array<number>(VOCAB_SIZE).fill(0);
  vec[index] = 1;
  return vec;
}

/** Sparse non-negative activation: ReLU, then keep only the top-k responses. */
export function sparsify(vec: number[], k: number): number[] {
  const relu = vec.map((v) => Math.max(0, v));
  const order = relu
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value || a.index - b.index);
  const keep = new Set(order.slice(0, k).filter((entry) => entry.value > 0).map((entry) => entry.index));
  const sparse = relu.map((v, i) => (keep.has(i) ? v : 0));
  const max = Math.max(...sparse);
  return max > 0 ? sparse.map((v) => v / max) : sparse;
}

/** One latent refinement step: activation @ synapses, then re-sparsify. */
export function latentStep(activation: number[], state: SynapseMatrix, k: number): number[] {
  const raw = new Array<number>(VOCAB_SIZE).fill(0);
  for (let j = 0; j < VOCAB_SIZE; j++) {
    let sum = 0;
    for (let i = 0; i < VOCAB_SIZE; i++) sum += activation[i] * state[i][j];
    raw[j] = sum;
  }
  return sparsify(raw, k);
}

function activeIndexOf(activation: number[]): number | null {
  let best = -1;
  let bestValue = 0;
  activation.forEach((value, index) => {
    if (value > bestValue) {
      bestValue = value;
      best = index;
    }
  });
  return best === -1 ? null : best;
}

/** Runs a query through `latentSteps` of recurrent refinement, recording every intermediate activation. */
export function runQuery(state: SynapseMatrix, query: SymbolIndex, params: DynamicsParams, groundTruthFn: (x: SymbolIndex) => SymbolIndex): QueryTrace {
  let activation = oneHot(query);
  const history: LatentStepResult[] = [{ step: 0, activation, activeIndex: query }];

  for (let step = 1; step <= params.latentSteps; step++) {
    activation = latentStep(activation, state, params.sparsityK);
    history.push({ step, activation, activeIndex: activeIndexOf(activation) });
  }

  const answerIndex = activeIndexOf(activation);
  const groundTruthIndex = groundTruthFn(query);

  return {
    query,
    history,
    answerIndex,
    groundTruthIndex,
    matches: answerIndex !== null && answerIndex === groundTruthIndex,
  };
}
