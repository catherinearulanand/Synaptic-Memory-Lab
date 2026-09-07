# AI Assistance Disclosure

This project was built with Claude Code (Anthropic), an AI coding assistant, working directly in this repository under the direction of a human maintainer.

## What the AI did

- Designed the toy dynamics engine (Hebbian update, sparse activation, latent refinement) and the three-task suite, including the specific demonstration pools and the two-hop "Two-Step Composite Rule" task used to operationalize the project's central claim.
- Designed and implemented the single-hop attention baseline and its KV-cache instrumentation.
- Wrote the entire TypeScript/React codebase: the dynamics and baseline libraries, the precompute script, the UI components, the design tokens (against a supplied color/type specification), and the Vitest test suite.
- Wrote the narrative content: guided-walkthrough captions, the BDH module text and mechanism-mapping table, the limitations section, this README, the one-page concept summary, and the blog.
- Researched the primary sources cited in the README and the blog: fetched and read the abstract and content of the Dragon Hatchling paper (arXiv:2509.26507), the BDH-CQ report (arXiv:2608.09888), Pathway's own BDH explainer page, and the `pathwaycom/bdh` repository documentation, plus verified the bibliographic details (authors, arXiv IDs, dates, venues) of three further primary papers (RetNet, DeltaNet, Titans) used as comparative context. Every specific number attributed to a primary source in the blog (parameter ranges, benchmark scores, costs) was taken from that source directly, not estimated or recalled from training data.
- Verified the build by running the test suite, the TypeScript compiler, a production build, and by exercising the running application in a browser (guided walkthrough, sandbox controls, mobile layout). Verified the generated PDFs (blog and one-page summary) by rendering them to images and checking for text-encoding or layout defects.
- Committed and pushed the project to its GitHub repository at the maintainer's explicit instruction, after the verification steps above.

## What the AI did not do

- The AI did not independently reproduce or run the BDH or BDH-CQ models. All claims about their reported results are drawn from the primary sources above, not from independent experimentation.
- The AI did not deploy this project to a public demo URL. That step requires the maintainer's own hosting account and is left as a deliberate next step (see the README's Deployment section).
- The toy equations, task design, and mechanism in this lab are an original, labeled simplification — not a port of BDH's actual formulation, which the primary sources should be consulted for directly.

## Human role

A human maintainer specified the project brief (via a frontend/UX specification and an implementation plan document, followed by the official DataForge 2026 Pathway Track problem statement), the target claim, the reference architecture, and the primary-source whitelist; reviewed and approved the technical approach before implementation began; directed the research and blog-writing phase; and is responsible for the final submission, including understanding and defending every component described above.
