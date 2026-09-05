import type { Controls } from '../state/AppContext';

export interface GuidedStep {
  title: string;
  caption: string;
  controls: Partial<Controls>;
  showBaseline: boolean;
}

export const GUIDED_STEPS: GuidedStep[] = [
  {
    title: 'Meet the system',
    caption:
      'Eight symbols, sixty-four possible synapses. At rest, every synapse is silent — no associations have been written yet. This fixed-size state is the entire memory the system will ever have for this task; nothing about it grows as demonstrations are added.',
    controls: { demonstrationCount: 0, latentSteps: 1 },
    showBaseline: false,
  },
  {
    title: 'Give it demonstrations',
    caption:
      'Three demonstrations have been added. Each is a single symbol-to-symbol pair, shown once. Watch the corresponding synapses strengthen immediately — this is the entire learning rule: local, Hebbian, applied the instant a pair is demonstrated.',
    controls: { demonstrationCount: 3, latentSteps: 1 },
    showBaseline: false,
  },
  {
    title: 'Watch the state change',
    caption:
      'Three more demonstrations complete the set. Two separate associations are now encoded — a symbol to an intermediate symbol, and that intermediate to a final one. Neither demonstration alone contains the answer to the question about to be asked.',
    controls: { demonstrationCount: 6, latentSteps: 1 },
    showBaseline: false,
  },
  {
    title: 'Ask a new question',
    caption:
      'Query α. At one latent refinement step, the system reaches only the intermediate symbol — it has not yet chained the second association. Ground truth sits beside the answer, so the mismatch is visible rather than implied. Move latent refinement from 1 to 2 in the panel on the left and watch what happens.',
    controls: { demonstrationCount: 6, latentSteps: 1 },
    showBaseline: false,
  },
  {
    title: 'Compare',
    caption:
      'With two latent steps, the same fixed-size state reaches the correct answer — no new synapse was added to do it. Beside it, the baseline: a single-hop attention lookup whose cache has grown with every demonstration, and which has no mechanism to chain the two associations at all.',
    controls: { demonstrationCount: 6, latentSteps: 2 },
    showBaseline: true,
  },
];
