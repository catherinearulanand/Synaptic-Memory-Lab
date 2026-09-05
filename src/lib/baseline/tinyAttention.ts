import { VOCAB_SIZE } from '../dynamics/types';
import type { Demonstration, SymbolIndex } from '../dynamics/types';

/**
 * Educational re-implementation of a single-hop, untrained dot-product attention
 * lookup — not a trained neural network. Keys/queries are one-hot symbol embeddings,
 * so attention degenerates to "was this exact symbol demonstrated?" with no
 * generalization and no recurrence. Every demonstration adds two entries (an x token
 * and a y token) to the cache, which is instrumented and shown growing.
 */

interface KVEntry {
  key: number[];
  valueIndex: SymbolIndex;
}

export interface BaselineTrace {
  query: SymbolIndex;
  cacheSize: number;
  attentionWeights: number[];
  cacheLabels: SymbolIndex[];
  answerIndex: number | null;
  groundTruthIndex: SymbolIndex;
  matches: boolean;
}

function oneHot(index: SymbolIndex): number[] {
  const vec = new Array<number>(VOCAB_SIZE).fill(0);
  vec[index] = 1;
  return vec;
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function softmax(scores: number[]): number[] {
  if (scores.length === 0) return [];
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function runBaselineQuery(
  demonstrations: Demonstration[],
  query: SymbolIndex,
  groundTruthFn: (x: SymbolIndex) => SymbolIndex,
): BaselineTrace {
  const cache: KVEntry[] = demonstrations.map((d) => ({ key: oneHot(d.x), valueIndex: d.y }));
  const groundTruthIndex = groundTruthFn(query);

  if (cache.length === 0) {
    return { query, cacheSize: 0, attentionWeights: [], cacheLabels: [], answerIndex: null, groundTruthIndex, matches: false };
  }

  const qVec = oneHot(query);
  const scores = cache.map((entry) => dot(qVec, entry.key));
  const attentionWeights = softmax(scores);

  const exactMatch = cache.find((entry) => entry.key[query] === 1);
  const answerIndex = exactMatch ? exactMatch.valueIndex : null;

  return {
    query,
    cacheSize: cache.length * 2,
    attentionWeights,
    cacheLabels: demonstrations.map((d) => d.x),
    answerIndex,
    groundTruthIndex,
    matches: answerIndex !== null && answerIndex === groundTruthIndex,
  };
}
