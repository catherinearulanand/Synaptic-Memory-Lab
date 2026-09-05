import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyDemonstrations, runQuery } from '../src/lib/dynamics/core';
import { activeDemonstrations, getTask } from '../src/lib/dynamics/tasks';
import { runBaselineQuery } from '../src/lib/baseline/tinyAttention';
import type { DynamicsParams } from '../src/lib/dynamics/types';
import type { TrajectoryFixture } from '../src/lib/trajectory/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../fixtures');

const params: DynamicsParams = { plasticity: 0.6, decay: 0.05, sparsityK: 1, latentSteps: 2 };

function buildFixture(): TrajectoryFixture {
  const task = getTask('composite-chain');
  const demonstrations = activeDemonstrations(task, task.demonstrationPool.length);
  const state = applyDemonstrations(demonstrations, params.plasticity, params.decay);

  const traceOneStep = runQuery(state, task.defaultQuery, { ...params, latentSteps: 1 }, task.ruleFn);
  const traceTwoStep = runQuery(state, task.defaultQuery, { ...params, latentSteps: 2 }, task.ruleFn);
  const baseline = runBaselineQuery(demonstrations, task.defaultQuery, task.ruleFn);

  return {
    taskId: task.id,
    generatedAt: new Date().toISOString(),
    params,
    demonstrationCount: demonstrations.length,
    query: task.defaultQuery,
    state,
    traceOneStep,
    traceTwoStep,
    baseline,
  };
}

mkdirSync(outDir, { recursive: true });
const fixture = buildFixture();
const outPath = resolve(outDir, 'guided-walkthrough.json');
writeFileSync(outPath, JSON.stringify(fixture, null, 2));

console.log(`Wrote precomputed trajectory to ${outPath}`);
console.log(`  1-step answer: ${traceLabel(fixture.traceOneStep.answerIndex)} (matches=${fixture.traceOneStep.matches})`);
console.log(`  2-step answer: ${traceLabel(fixture.traceTwoStep.answerIndex)} (matches=${fixture.traceTwoStep.matches})`);
console.log(`  baseline answer: ${traceLabel(fixture.baseline.answerIndex)} (matches=${fixture.baseline.matches})`);

function traceLabel(index: number | null): string {
  return index === null ? 'none' : String(index);
}
