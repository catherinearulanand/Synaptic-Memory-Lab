export interface ToyEquation {
  label: string;
  expression: string;
  note: string;
}

export interface MechanismMapping {
  observed: string;
  concept: string;
}

export const BDH_MODULE = {
  intro:
    'Dragon Hatchling (BDH) is presented by its authors as an architecture positioned between the Transformer and biological models of computation: a recurrent system whose state is updated by local, Hebbian-style synaptic plasticity and whose activations are sparse and non-negative, in contrast to a Transformer’s attention over a cache that grows with every token. The toy model in this lab is a small, fully transparent re-implementation of that general idea — not a port of BDH’s actual equations, which involve mechanisms (such as its expansion representation and attention-as-Hebbian-learning formulation) that this lab does not reproduce.',
  toyEquations: [
    {
      label: 'Hebbian write (this lab’s toy rule)',
      expression: 'W ← max(0, (1 − δ)·W) + η · (x ⊗ y)',
      note: 'Every synapse decays by δ, then the one demonstrated synapse is strengthened by the plasticity rate η. Non-negative, local, and applied once per demonstration.',
    },
    {
      label: 'Sparse positive activation (this lab’s toy rule)',
      expression: 'a ← top‑k( ReLU( a · W ) )',
      note: 'Only the strongest response survives each step — an intentionally extreme, legible form of sparse, non-negative activation.',
    },
    {
      label: 'Latent refinement (this lab’s toy rule)',
      expression: 'a₍t+1₎ = sparsify( aₜ · W ),  t = 1 … T',
      note: 'The same fixed-size state is read repeatedly, T times, before an answer is read out. No token is ever emitted between steps.',
    },
  ] as ToyEquation[],
  mechanismMap: [
    {
      observed: 'The synapse matrix never resizes, no matter how many demonstrations are added.',
      concept: 'BDH is described as maintaining a fixed-size recurrent state rather than a cache that grows with sequence length.',
    },
    {
      observed: 'A synapse strengthens the instant its pair is demonstrated, with no gradient step and no separate training phase.',
      concept: 'BDH is described as using local, Hebbian-style synaptic updates in place of global backpropagated weight updates.',
    },
    {
      observed: 'Only the single strongest node stays active after each step; everything else is silenced.',
      concept: 'BDH is described as relying on sparse, non-negative activations, in contrast to the dense activations typical of standard Transformers.',
    },
    {
      observed: 'The composite-chain task is solved by repeating the same read step twice, with no intermediate symbol ever written out.',
      concept: 'BDH is positioned as reasoning through recurrent latent computation rather than an emitted, verbal chain of thought.',
    },
  ] as MechanismMapping[],
  whatIsChanging:
    'What changes as you move the controls: the plasticity rate governs how strongly a single demonstration is written into the synapse matrix; the number of demonstrations governs how much of the matrix has any signal in it at all; the latent-step count governs how many chained associations a single query can traverse before an answer is read out. The synapse matrix itself never changes size.',
  approximationNote:
    'Educational approximation of BDH-style dynamics — not the official BDH model. The equations above are this lab’s own simplified toy rules, built to be small enough that every number stays visible. For BDH’s actual formulation, see the primary sources linked below.',
};
