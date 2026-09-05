# Synaptic Memory Lab

**DataForge 2026 · Pathway Track**

An interactive educational lab that teaches one falsifiable claim:

> A fixed-size recurrent state updated by local Hebbian synaptic plasticity can encode a novel abstract rule from a handful of demonstrations and then apply it through repeated latent refinement — without allocating a new memory slot for every token and without ever emitting a verbal chain of thought.

Add a handful of demonstrations to a small, fully transparent 8×8 synapse matrix, then watch it answer a query through repeated latent refinement — compared, side by side, against a baseline whose memory grows with every example it's shown. Reference architecture: Dragon Hatchling (BDH).

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

See [`docs/ONE_PAGE_SUMMARY.md`](docs/ONE_PAGE_SUMMARY.md) for the full concept summary, and the in-app "Where this appears in BDH" module for the toy equations, what they map to, and the honest limits of the approximation.

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

This is a small, honest toy model, not a port of BDH's actual equations. See the in-app Limitations section for the two failure modes you can trigger yourself, and [`docs/ONE_PAGE_SUMMARY.md`](docs/ONE_PAGE_SUMMARY.md) for the full discussion.

## Deployment

`npm run build` produces a static `dist/` folder with no server-side dependency — deployable to any static host (Vercel, Netlify, GitHub Pages, etc.). Deployment and a public repository are the maintainer's next step; they are not performed by this codebase.

## Primary sources

- Kosowski et al., "The Dragon Hatchling: The Missing Link between the Transformer and Models of the Brain" — [arXiv:2509.26507](https://arxiv.org/abs/2509.26507)
- BDH-CQ technical report — [arXiv:2608.09888](https://arxiv.org/abs/2608.09888)
- [pathwaycom/bdh](https://github.com/pathwaycom/bdh) — official toy implementation
- Pathway's "From Attention to Synapses" and "The Equations of Reasoning" — see [pathway.com/blog](https://pathway.com/blog)

## AI assistance disclosure

See [`docs/AI_ASSISTANCE_DISCLOSURE.md`](docs/AI_ASSISTANCE_DISCLOSURE.md).

## License

MIT — see [`LICENSE`](LICENSE).
