import { describe, expect, it } from 'vitest';
import { runBaselineQuery } from '../src/lib/baseline/tinyAttention';
import { activeDemonstrations, getTask } from '../src/lib/dynamics/tasks';

describe('tiny attention baseline', () => {
  it('grows its KV cache by 2 for every demonstration', () => {
    const task = getTask('cyclic-shift');
    for (const count of [0, 1, 4, task.demonstrationPool.length]) {
      const demos = activeDemonstrations(task, count);
      const trace = runBaselineQuery(demos, task.defaultQuery, task.ruleFn);
      expect(trace.cacheSize).toBe(count * 2);
    }
  });

  it('is stuck at the single-hop intermediate result on the composite task and never recovers with more steps', () => {
    const task = getTask('composite-chain');
    const demos = activeDemonstrations(task, task.demonstrationPool.length);
    const trace = runBaselineQuery(demos, task.defaultQuery, task.ruleFn);
    expect(trace.matches).toBe(false);
    expect(trace.answerIndex).toBe(2); // the hop-1 intermediate, demonstrated directly as (0 -> 2)
  });

  it('cannot answer a query whose association was never demonstrated', () => {
    const task = getTask('arbitrary-lookup');
    const demos = activeDemonstrations(task, task.demonstrationPool.length);
    const trace = runBaselineQuery(demos, task.defaultQuery, task.ruleFn);
    expect(trace.answerIndex).toBeNull();
  });
});
