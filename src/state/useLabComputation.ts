import { useMemo } from 'react';
import { applyDemonstrations, runQuery } from '../lib/dynamics/core';
import { activeDemonstrations, getTask } from '../lib/dynamics/tasks';
import { runBaselineQuery } from '../lib/baseline/tinyAttention';
import { useAppState } from './AppContext';

const DECAY = 0.05;
const SPARSITY_K = 1;

export function useLabComputation() {
  const { taskId, query, controls } = useAppState();

  return useMemo(() => {
    const task = getTask(taskId);
    const demonstrations = activeDemonstrations(task, controls.demonstrationCount);
    const state = applyDemonstrations(demonstrations, controls.plasticity, DECAY);
    const trace = runQuery(
      state,
      query,
      { plasticity: controls.plasticity, decay: DECAY, sparsityK: SPARSITY_K, latentSteps: controls.latentSteps },
      task.ruleFn,
    );
    const baseline = runBaselineQuery(demonstrations, query, task.ruleFn);

    return { task, demonstrations, state, trace, baseline };
  }, [taskId, query, controls.demonstrationCount, controls.plasticity, controls.latentSteps]);
}
