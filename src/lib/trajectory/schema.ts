import type { DynamicsParams, QueryTrace, SymbolIndex, SynapseMatrix, TaskDefinition } from '../dynamics/types';
import type { BaselineTrace } from '../baseline/tinyAttention';

export interface TrajectoryFixture {
  taskId: TaskDefinition['id'];
  generatedAt: string;
  params: DynamicsParams;
  demonstrationCount: number;
  query: SymbolIndex;
  state: SynapseMatrix;
  traceOneStep: QueryTrace;
  traceTwoStep: QueryTrace;
  baseline: BaselineTrace;
}
