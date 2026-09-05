export const VOCAB_SIZE = 8;

export const SYMBOLS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'] as const;

export type SymbolIndex = number;

export interface Demonstration {
  x: SymbolIndex;
  y: SymbolIndex;
}

/** Fixed-size 8x8 non-negative synapse matrix. Never resized, regardless of demo count. */
export type SynapseMatrix = number[][];

export interface LatentStepResult {
  step: number;
  activation: number[];
  activeIndex: number | null;
}

export interface QueryTrace {
  query: SymbolIndex;
  history: LatentStepResult[];
  answerIndex: number | null;
  groundTruthIndex: number;
  matches: boolean;
}

export interface TaskDefinition {
  id: 'cyclic-shift' | 'arbitrary-lookup' | 'composite-chain';
  label: string;
  description: string;
  requiredLatentSteps: number;
  demonstrationPool: Demonstration[];
  defaultQuery: SymbolIndex;
  ruleFn: (x: SymbolIndex) => SymbolIndex;
}

export interface DynamicsParams {
  plasticity: number;
  decay: number;
  sparsityK: number;
  latentSteps: number;
}
