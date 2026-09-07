# Synaptic Memory Lab

**DataForge 2026 · Pathway Track**

An interactive educational lab that teaches one falsifiable claim:

> A fixed-size recurrent state updated by local Hebbian synaptic plasticity can encode a novel abstract rule from a handful of demonstrations and then apply it through repeated latent refinement — without allocating a new memory slot for every token and without ever emitting a verbal chain of thought.

Add a handful of demonstrations to a small, fully transparent 8×8 synapse matrix, then watch it answer a query through repeated latent refinement — compared, side by side, against a baseline whose memory grows with every example it's shown. Reference architecture: Dragon Hatchling (BDH).

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
| Interactive artifact (this repo, runs locally — see [Running it](#running-it)) | this repository |
| Blog: research write-up connecting this project to BDH, BDH-CQ, and the wider fixed-size-memory literature | [`docs/BLOG.pdf`](docs/BLOG.pdf) ([source](docs/BLOG.md)) |
| One-page concept summary | [`docs/ONE_PAGE_SUMMARY.pdf`](docs/ONE_PAGE_SUMMARY.pdf) ([source](docs/ONE_PAGE_SUMMARY.md)) |
| AI assistance disclosure | [`docs/AI_ASSISTANCE_DISCLOSURE.md`](docs/AI_ASSISTANCE_DISCLOSURE.md) |
| Source code repository | this repository |
| License | [`LICENSE`](LICENSE) (MIT) |

A public, no-sign-in demo URL is not yet deployed — see [Deployment](#deployment).

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

`npm run build` produces a static `dist/` folder with no server-side dependency — deployable to any static host (Vercel, Netlify, GitHub Pages, etc.). Deploying it to a public, no-sign-in URL is the maintainer's next step; it is not performed by this codebase.

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

## AI assistance disclosure

See [`docs/AI_ASSISTANCE_DISCLOSURE.md`](docs/AI_ASSISTANCE_DISCLOSURE.md).

## License

MIT — see [`LICENSE`](LICENSE).
