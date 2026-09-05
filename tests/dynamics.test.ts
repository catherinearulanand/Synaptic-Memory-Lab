import { describe, expect, it } from 'vitest';
import { applyDemonstrations, createEmptyState, hebbianUpdate, runQuery } from '../src/lib/dynamics/core';
import { VOCAB_SIZE } from '../src/lib/dynamics/types';
import { activeDemonstrations, getTask } from '../src/lib/dynamics/tasks';
import type { DynamicsParams } from '../src/lib/dynamics/types';

const baseParams: DynamicsParams = { plasticity: 0.6, decay: 0.05, sparsityK: 1, latentSteps: 1 };

describe('fixed-size state invariant', () => {
  it('stays VOCAB_SIZE x VOCAB_SIZE regardless of demonstration count', () => {
    const task = getTask('cyclic-shift');
    for (const count of [0, 1, 3, task.demonstrationPool.length]) {
      const state = applyDemonstrations(activeDemonstrations(task, count), baseParams.plasticity, baseParams.decay);
      expect(state.length).toBe(VOCAB_SIZE);
      state.forEach((row) => expect(row.length).toBe(VOCAB_SIZE));
    }
  });

  it('never produces negative weights', () => {
    let state = createEmptyState();
    for (let i = 0; i < 20; i++) {
      state = hebbianUpdate(state, { x: i % VOCAB_SIZE, y: (i + 1) % VOCAB_SIZE }, 0.7, 0.2);
    }
    state.forEach((row) => row.forEach((v) => expect(v).toBeGreaterThanOrEqual(0)));
  });
});

describe('hebbianUpdate', () => {
  it('strengthens exactly the demonstrated synapse and decays the rest', () => {
    let state = createEmptyState();
    state = hebbianUpdate(state, { x: 0, y: 1 }, 0.5, 0.1);
    expect(state[0][1]).toBeCloseTo(0.5);

    const next = hebbianUpdate(state, { x: 2, y: 3 }, 0.5, 0.1);
    expect(next[0][1]).toBeCloseTo(0.5 * 0.9);
    expect(next[2][3]).toBeCloseTo(0.5);
  });
});

describe('single-hop tasks (cyclic-shift, arbitrary-lookup)', () => {
  it('cyclic-shift answers correctly once its query pair has been demonstrated', () => {
    const task = getTask('cyclic-shift');
    const demos = activeDemonstrations(task, task.demonstrationPool.length);
    const state = applyDemonstrations(demos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, baseParams, task.ruleFn);
    expect(trace.matches).toBe(true);
  });

  it('cyclic-shift has no confident answer before its query pair is demonstrated', () => {
    const task = getTask('cyclic-shift');
    const demos = activeDemonstrations(task, 2); // query pair is the 5th demo
    const state = applyDemonstrations(demos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, baseParams, task.ruleFn);
    expect(trace.answerIndex).toBeNull();
    expect(trace.matches).toBe(false);
  });

  it('arbitrary-lookup can never answer its default query — that association is never demonstrated', () => {
    const task = getTask('arbitrary-lookup');
    const demos = activeDemonstrations(task, task.demonstrationPool.length);
    const state = applyDemonstrations(demos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, baseParams, task.ruleFn);
    expect(trace.answerIndex).toBeNull();
  });
});

describe('composite-chain task — the falsifiable claim', () => {
  const task = getTask('composite-chain');
  const demos = activeDemonstrations(task, task.demonstrationPool.length);

  it('fails at 1 latent step (only reaches the intermediate hop)', () => {
    const state = applyDemonstrations(demos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, { ...baseParams, latentSteps: 1 }, task.ruleFn);
    expect(trace.matches).toBe(false);
  });

  it('succeeds at 2 latent steps, with the exact same fixed-size state', () => {
    const state = applyDemonstrations(demos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, { ...baseParams, latentSteps: 2 }, task.ruleFn);
    expect(trace.matches).toBe(true);
    expect(state.length).toBe(VOCAB_SIZE);
  });

  it('fails at 2 latent steps if only the first hop was demonstrated', () => {
    const partialDemos = activeDemonstrations(task, 3); // hop-1 pairs only
    const state = applyDemonstrations(partialDemos, baseParams.plasticity, baseParams.decay);
    const trace = runQuery(state, task.defaultQuery, { ...baseParams, latentSteps: 2 }, task.ruleFn);
    expect(trace.matches).toBe(false);
  });
});
