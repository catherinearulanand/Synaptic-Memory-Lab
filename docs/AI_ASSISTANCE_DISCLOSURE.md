# AI Assistance Disclosure

This project was built with Claude Code (Anthropic), an AI coding assistant, working directly in this repository.

## What the AI did

- Designed the toy dynamics engine (Hebbian update, sparse activation, latent refinement) and the three-task suite, including the specific demonstration pools and the two-hop "Two-Step Composite Rule" task used to operationalize the project's central claim.
- Designed and implemented the single-hop attention baseline and its KV-cache instrumentation.
- Wrote the entire TypeScript/React codebase: the dynamics and baseline libraries, the precompute script, the UI components, the design tokens (against a supplied color/type specification), and the Vitest test suite.
- Wrote the narrative content: guided-walkthrough captions, the BDH module text and mechanism-mapping table, the limitations section, this README, and the one-page concept summary.
- Verified the build by running the test suite, the TypeScript compiler, a production build, and by exercising the running application in a browser (guided walkthrough, sandbox controls, mobile layout).

## What the AI did not do

- The AI has not read the primary BDH papers (arXiv:2509.26507, arXiv:2608.09888) directly. All statements about BDH's actual mechanism are deliberately general, hedged ("BDH is described as..."), and limited to the high-level characterization already supplied in this project's own specification documents. The toy equations in this lab are original, labeled as this lab's own simplification, and explicitly separated from BDH's actual formulation. Anyone verifying a specific technical claim about BDH should consult the primary sources linked in the README and in the app's "Evidence & Sources" section.
- The AI did not deploy this project to a public URL, create a GitHub repository, or push any code to a remote — those steps require the maintainer's own hosting and GitHub accounts and are left as a deliberate next step.

## Human role

A human maintainer specified the project brief (via two source documents: a frontend/UX specification and an implementation plan), the target claim, the reference architecture, and the primary-source whitelist; reviewed and approved the technical approach before implementation began; and is responsible for the final submission.
