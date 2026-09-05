export interface Citation {
  label: string;
  detail: string;
  url?: string;
}

export const CITATIONS: Citation[] = [
  {
    label: 'Kosowski et al., "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain"',
    detail: 'Primary source for the BDH architecture referenced throughout this lab.',
    url: 'https://arxiv.org/abs/2509.26507',
  },
  {
    label: 'BDH-CQ technical report',
    detail: 'Follow-up technical report on the BDH-CQ variant.',
    url: 'https://arxiv.org/abs/2608.09888',
  },
  {
    label: 'pathwaycom/bdh — official toy implementation',
    detail: 'Reference implementation maintained by the paper’s authors.',
    url: 'https://github.com/pathwaycom/bdh',
  },
  {
    label: 'Pathway — "From Attention to Synapses" and "The Equations of Reasoning"',
    detail: 'Pathway’s own explanatory posts on the mechanism. See pathway.com/blog for current links.',
    url: 'https://pathway.com/blog',
  },
];
