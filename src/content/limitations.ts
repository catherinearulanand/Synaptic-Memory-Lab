export interface FailureMode {
  title: string;
  howToTrigger: string;
  whatHappens: string;
}

export const FAILURE_MODES: FailureMode[] = [
  {
    title: 'No evidence, no answer',
    howToTrigger:
      'Select the "Arbitrary Lookup" task and query η. Its association was never placed in the demonstration pool, at any demonstration count.',
    whatHappens:
      'The system reports no confident association, honestly, rather than guessing. A plain Hebbian associative memory can only retrieve what it has literally been shown — it has no mechanism for generalizing to an input it has never seen paired with anything.',
  },
  {
    title: 'More refinement cannot substitute for missing evidence',
    howToTrigger:
      'Select the "Two-Step Composite Rule" task, set demonstrations to 3 (the first hop only), and raise latent refinement to 2 or more.',
    whatHappens:
      'The system still reaches no confident answer. The second association was never demonstrated, so there is nothing for the second latent step to traverse. Repeated refinement helps only when the needed associations already exist in the state.',
  },
];

export const OPEN_QUESTIONS =
  'This lab’s toy model is deliberately small: eight symbols, a single fixed-size matrix, top-1 sparsity, and no gradient training for either the synaptic model or the baseline. Whether and how the BDH family generalizes beyond literally demonstrated associations, scales its state, or behaves under noisy or adversarial demonstrations are questions for the primary sources — this toy model is not evidence about BDH itself, only an illustration of the mechanism it is inspired by.';
