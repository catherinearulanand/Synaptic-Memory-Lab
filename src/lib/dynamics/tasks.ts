import type { Demonstration, TaskDefinition } from './types';

const CYCLIC_SHIFT_K = 3;

const cyclicShift: TaskDefinition = {
  id: 'cyclic-shift',
  label: 'Cyclic Shift',
  description: 'Each symbol maps to the symbol three positions ahead, wrapping around the vocabulary.',
  requiredLatentSteps: 1,
  demonstrationPool: [
    { x: 0, y: 3 },
    { x: 1, y: 4 },
    { x: 2, y: 5 },
    { x: 4, y: 7 },
    { x: 5, y: 0 },
    { x: 6, y: 1 },
  ],
  defaultQuery: 5,
  ruleFn: (x) => (x + CYCLIC_SHIFT_K) % 8,
};

const LOOKUP_TABLE = [5, 7, 0, 6, 1, 3, 2, 4];

const arbitraryLookup: TaskDefinition = {
  id: 'arbitrary-lookup',
  label: 'Arbitrary Lookup',
  description: 'Each symbol maps to an unrelated symbol with no shared pattern — pure memorization, nothing to infer.',
  requiredLatentSteps: 1,
  demonstrationPool: [
    { x: 0, y: 5 },
    { x: 1, y: 7 },
    { x: 2, y: 0 },
    { x: 4, y: 1 },
    { x: 5, y: 3 },
  ],
  defaultQuery: 6,
  ruleFn: (x) => LOOKUP_TABLE[x],
};

const HOP1: Record<number, number> = { 0: 2, 1: 5, 3: 6 };
const HOP2: Record<number, number> = { 2: 7, 5: 4, 6: 1 };

const compositeChain: TaskDefinition = {
  id: 'composite-chain',
  label: 'Two-Step Composite Rule',
  description: 'The answer requires two chained associations: first symbol to intermediate, then intermediate to final. No single hop reaches it.',
  requiredLatentSteps: 2,
  demonstrationPool: [
    { x: 0, y: 2 },
    { x: 1, y: 5 },
    { x: 3, y: 6 },
    { x: 2, y: 7 },
    { x: 5, y: 4 },
    { x: 6, y: 1 },
  ],
  defaultQuery: 0,
  ruleFn: (x) => {
    const mid = HOP1[x];
    if (mid === undefined) return x;
    return HOP2[mid] ?? mid;
  },
};

export const TASKS: TaskDefinition[] = [cyclicShift, arbitraryLookup, compositeChain];

export function getTask(id: TaskDefinition['id']): TaskDefinition {
  const task = TASKS.find((t) => t.id === id);
  if (!task) throw new Error(`Unknown task: ${id}`);
  return task;
}

export function activeDemonstrations(task: TaskDefinition, count: number): Demonstration[] {
  return task.demonstrationPool.slice(0, Math.max(0, Math.min(count, task.demonstrationPool.length)));
}
