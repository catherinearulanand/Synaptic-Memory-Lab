import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { SymbolIndex, TaskDefinition } from '../lib/dynamics/types';
import { getTask } from '../lib/dynamics/tasks';

export type Mode = 'landing' | 'guided' | 'lab';

export interface Controls {
  plasticity: number;
  demonstrationCount: number;
  latentSteps: number;
}

export interface AppState {
  mode: Mode;
  guidedStep: number;
  taskId: TaskDefinition['id'];
  query: SymbolIndex;
  controls: Controls;
  showBaseline: boolean;
  scrubStep: number | null;
}

export const GUIDED_STEP_COUNT = 5;

const initialControls: Controls = { plasticity: 0.6, demonstrationCount: 2, latentSteps: 1 };

const initialState: AppState = {
  mode: 'landing',
  guidedStep: 0,
  taskId: 'composite-chain',
  query: getTask('composite-chain').defaultQuery,
  controls: initialControls,
  showBaseline: true,
  scrubStep: null,
};

type Action =
  | { type: 'SET_MODE'; mode: Mode }
  | { type: 'SET_GUIDED_STEP'; step: number }
  | { type: 'SET_TASK'; taskId: TaskDefinition['id'] }
  | { type: 'SET_QUERY'; query: SymbolIndex }
  | { type: 'SET_CONTROL'; controls: Partial<Controls> }
  | { type: 'TOGGLE_BASELINE' }
  | { type: 'SET_BASELINE'; show: boolean }
  | { type: 'SET_SCRUB'; step: number | null }
  | { type: 'RESET_TASK' }
  | { type: 'APPLY_GUIDED_STEP'; controls: Partial<Controls>; showBaseline: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE': {
      if (action.mode === 'guided') {
        const task = getTask('composite-chain');
        return {
          ...state,
          mode: 'guided',
          guidedStep: 0,
          taskId: task.id,
          query: task.defaultQuery,
          controls: { ...initialControls, demonstrationCount: 0, latentSteps: 1 },
          showBaseline: false,
          scrubStep: null,
        };
      }
      return { ...state, mode: action.mode };
    }
    case 'SET_GUIDED_STEP':
      return { ...state, guidedStep: Math.max(0, Math.min(GUIDED_STEP_COUNT - 1, action.step)) };
    case 'SET_TASK': {
      const task = getTask(action.taskId);
      return {
        ...state,
        taskId: action.taskId,
        query: task.defaultQuery,
        controls: { ...state.controls, demonstrationCount: Math.min(2, task.demonstrationPool.length) },
        scrubStep: null,
      };
    }
    case 'SET_QUERY':
      return { ...state, query: action.query, scrubStep: null };
    case 'SET_CONTROL':
      return { ...state, controls: { ...state.controls, ...action.controls }, scrubStep: null };
    case 'TOGGLE_BASELINE':
      return { ...state, showBaseline: !state.showBaseline };
    case 'SET_BASELINE':
      return { ...state, showBaseline: action.show };
    case 'SET_SCRUB':
      return { ...state, scrubStep: action.step };
    case 'RESET_TASK':
      return { ...state, controls: { ...initialControls, demonstrationCount: 0 }, scrubStep: null };
    case 'APPLY_GUIDED_STEP':
      return {
        ...state,
        controls: { ...state.controls, ...action.controls },
        showBaseline: action.showBaseline,
        scrubStep: null,
      };
    default:
      return state;
  }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}
