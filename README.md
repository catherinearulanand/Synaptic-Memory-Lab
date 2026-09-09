# Synaptic Memory Lab

**DataForge 2026 · Pathway Track**

An interactive educational lab that teaches one falsifiable claim:

> A fixed-size recurrent state updated by local Hebbian synaptic plasticity can encode a novel abstract rule from a handful of demonstrations and then apply it through repeated latent refinement — without allocating a new memory slot for every token and without ever emitting a verbal chain of thought.

Add a handful of demonstrations to a small, fully transparent 8×8 synapse matrix, then watch it answer a query through repeated latent refinement — compared, side by side, against a baseline whose memory grows with every example it's shown. Reference architecture: Dragon Hatchling (BDH).

**Live demo:** [synaptic-memory-lab-rust.vercel.app](https://synaptic-memory-lab-rust.vercel.app) — public, no sign-in required.

## Who this is for

**Audience:** data scientists and ML practitioners with a working understanding of attention and Transformers, but no assumed familiarity with BDH, Hebbian learning, or associative memory specifically.

**Prerequisites:** matrix multiplication, what a KV cache is and why it grows with context length, and a basic notion of "activation."

**Learning objectives.** After the guided walkthrough, you should be able to:
1. State the one-sentence claim above in your own words, and say what would falsify it.
2. Explain why a fixed-size Hebbian write can't do what a growing key-value cache does, and vice versa.
3. Predict, before running it, whether one latent-refinement step is enough to solve a two-hop association — and why.
4. Name one concrete thing this toy model cannot do (see [Limitations](#limitations)), and why that's a property of its representation, not a bug.
5. Place BDH and BDH-CQ within the broader landscape of fixed-size-memory architectures (RetNet, DeltaNet, Titans) covered in the blog.

## Running it

```bash
npm install
npm run dev
```

Open the printed local URL. The guided walkthrough (`Begin the walkthrough`) reaches the core insight in under 90 seconds; `Jump to laboratory` opens free-form sandbox exploration.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build a static, deployable `dist/` bundle |
| `npm run typecheck` | Type-check only |
| `npm test` | Run the Vitest suite covering the dynamics engine and baseline |
| `npm run precompute` | Regenerate `fixtures/guided-walkthrough.json` from the live dynamics engine |

## How it's built

Everything — the synaptic dynamics, the sparse activation rule, the latent-refinement loop, and the baseline attention lookup — is one small TypeScript library (`src/lib/`) with no DOM or React dependency. That same code:

- runs **live**, in the browser, every time a control in the sandbox changes (real computation, not a scripted animation), and
- is reused, unmodified, by `scripts/precompute.ts` to bake a fixed, validated trajectory into `fixtures/guided-walkthrough.json`, used only for the final step of the guided walkthrough and clearly labeled in the UI as precomputed.

See the in-app "Where this appears in BDH" module for the toy equations, what they map to, and the honest limits of the approximation.

## Deliverables

| What | Where |
|---|---|
| Public, no-sign-in artifact URL | [synaptic-memory-lab-rust.vercel.app](https://synaptic-memory-lab-rust.vercel.app) |
| Public source code repository | [github.com/catherinearulanand/Synaptic-Memory-Lab](https://github.com/catherinearulanand/Synaptic-Memory-Lab) |
| Blog: research write-up connecting this project to BDH, BDH-CQ, and the wider fixed-size-memory literature | [`docs/BLOG.pdf`](docs/BLOG.pdf) ([source](docs/BLOG.md)) |
| One-page concept summary | [`docs/ONE_PAGE_SUMMARY.pdf`](docs/ONE_PAGE_SUMMARY.pdf) ([source](docs/ONE_PAGE_SUMMARY.md)) |
| AI assistance, code, data, asset & license disclosure | [`docs/AI_ASSISTANCE_DISCLOSURE.md`](docs/AI_ASSISTANCE_DISCLOSURE.md) and [Source and license record](#source-and-license-record) below |
| License | [`LICENSE`](LICENSE) (MIT) |

### Project layout

```
src/lib/dynamics/     Hebbian update, sparse activation, latent refinement, the 3 toy tasks
src/lib/baseline/     tiny single-hop attention baseline with KV-cache instrumentation
src/lib/trajectory/   fixture schema + loader
src/state/            app state (React context + reducer) and the derived-computation hook
src/content/          all narrative copy, kept as data rather than embedded in JSX
src/components/       Landing, guided walkthrough overlay, laboratory (graph, timeline,
                       output, baseline panel, controls), BDH module, limitations
scripts/precompute.ts regenerates fixtures/guided-walkthrough.json
tests/                Vitest unit tests for the dynamics engine and the baseline
```

## Limitations

This is a small, honest toy model, not a port of BDH's actual equations. See the in-app Limitations section for the two failure modes you can trigger yourself, and [`docs/ONE_PAGE_SUMMARY.pdf`](docs/ONE_PAGE_SUMMARY.pdf) for the full discussion.

## Deployment

`npm run build` produces a static `dist/` folder with no server-side dependency. It's deployed on Vercel at [synaptic-memory-lab-rust.vercel.app](https://synaptic-memory-lab-rust.vercel.app), connected directly to this repository's `main` branch — every push redeploys automatically. No environment variables or server-side config are required.

## Regenerating the PDFs

`docs/BLOG.md` and `docs/ONE_PAGE_SUMMARY.md` are the source of truth; the `.pdf` files next to them are rendered from that Markdown via `python scripts/render_docs_pdf.py` (requires `pip install reportlab` and, currently, Windows — see the script's docstring for why). Edit the `.md`, then re-run the script.

## Primary sources

**BDH and BDH-CQ:**
- Kosowski, Uznański, Chorowski, Stamirowska & Bartoszkiewicz, "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain" (2025) — [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
- Engdahl, Kosowski, Chorowski, Stamirowska, Uznański, Jiang, Phadke, Kinas & Zhong, "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning" (2026) — [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
- [pathwaycom/bdh](https://github.com/pathwaycom/bdh) — official implementation, MIT license
- Pathway, ["BDH: The Dragon Hatchling architecture, explained"](https://pathway.com/research/bdh-explainer)

**Recent primary papers (2022–2026) on fixed-size, associative, and recurrent-latent memory** — the wider context the blog situates BDH against:
- Sun, Dong, Huang, Ma, Xia, Xue, Wang & Wei, "Retentive Network: A Successor to Transformer for Large Language Models" (2023) — [arXiv:2307.08621](https://arxiv.org/abs/2307.08621)
- Yang, Wang, Zhang, Shen & Kim, "Parallelizing Linear Transformers with the Delta Rule over Sequence Length" (2024, NeurIPS) — [arXiv:2406.06484](https://arxiv.org/abs/2406.06484)
- Behrouz, Zhong & Mirrokni, "Titans: Learning to Memorize at Test Time" (2024) — [arXiv:2501.00663](https://arxiv.org/abs/2501.00663)

See [`docs/BLOG.pdf`](docs/BLOG.pdf) for how these connect to the claim this lab teaches, with citations beside each technical claim.

## Source and license record

**Code.** All application code (`src/`, `scripts/`, `tests/`) is original, written for this project, and licensed under this repository's MIT license.

**Data.** The three toy tasks and their demonstration pools (`src/lib/dynamics/tasks.ts`) are synthetic and original to this project — no external dataset is used anywhere in the app.

**Model weights.** None. The dynamics engine and the baseline are both rule-based (Hebbian update / fixed similarity lookup), not trained — there are no weights to source.

**Graphics.** The synaptic-graph visualization and the landing-page motif are inline SVG, authored for this project. The favicon (`public/favicon.svg`) is likewise original.

**Fonts.** [Montserrat](https://github.com/JulietaUla/Montserrat) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), both licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL), bundled via [`@fontsource`](https://fontsource.org/) (`node_modules/@fontsource/*/LICENSE`).

**Reused components (npm dependencies):** React & React DOM (MIT), Vite & `@vitejs/plugin-react` (MIT), TypeScript (Apache-2.0), Vitest (MIT), `tsx` (MIT), `oxlint` (MIT). See `package.json` for exact versions; each package's own license file governs its terms.

**Reference architecture.** Dragon Hatchling (BDH) and its [official implementation](https://github.com/pathwaycom/bdh) (MIT-licensed) are cited and described, not incorporated as code — see [Primary sources](#primary-sources).

## AI assistance disclosure

See [`docs/AI_ASSISTANCE_DISCLOSURE.md`](docs/AI_ASSISTANCE_DISCLOSURE.md).

## Licenses & third-party assets

| Component | Source | License |
|-----------|--------|---------|
| Project source code (this repository) | Original | MIT — see [`LICENSE`](LICENSE) |
| Interactive artifact / demo | This repository + Vercel deployment | MIT |
| Blog and one-page summary | Original (`docs/BLOG.md`, `docs/ONE_PAGE_SUMMARY.md`) | MIT |
| Fonts — JetBrains Mono | [`@fontsource/jetbrains-mono`](https://fontsource.org/fonts/jetbrains-mono) | OFL-1.1 |
| Fonts — Montserrat | [`@fontsource/montserrat`](https://fontsource.org/fonts/montserrat) | OFL-1.1 |
| React, React DOM, Vite, TypeScript, Vitest | npm packages | MIT |
| Reference architecture (BDH) | [pathwaycom/bdh](https://github.com/pathwaycom/bdh) | MIT |
| Data / model weights | None used — all dynamics are a small original toy engine | N/A |
| Graphics / icons | Original SVG motif in the landing page | MIT |

No external datasets, pretrained weights, or proprietary assets are included or required to run the project.
