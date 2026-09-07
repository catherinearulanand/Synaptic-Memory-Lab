# Synaptic Memory Lab — Concept Summary

**DataForge 2026 · Pathway Track**

## The claim

A fixed-size recurrent state, updated by local Hebbian synaptic plasticity, can encode a novel abstract rule from a handful of demonstrations and then apply it through repeated latent refinement — without allocating a new memory slot for every token, and without ever emitting a verbal chain of thought.

This lab makes that claim concrete and falsifiable with a toy model small enough that every relevant number stays visible: eight symbols, a single 8×8 synapse matrix, and a query that either succeeds or fails in a way you can inspect directly.

## The mechanism

The entire memory of the system is an 8×8 matrix of non-negative synapse weights. It never resizes. Showing the system a demonstration — a single symbol-to-symbol pair — does one thing: the corresponding synapse strengthens by a fixed plasticity rate, every other synapse decays slightly, and the result is clipped to stay non-negative. There is no separate training phase, no gradient, and no loss function. The update is local (it touches one synapse) and Hebbian (it strengthens exactly the connection that was just co-activated).

Answering a query is a second, distinct process: repeated latent refinement. The query symbol becomes an activation vector, which is repeatedly multiplied against the synapse matrix and re-sparsified — keeping only the single strongest response at each step — for a controllable number of steps before an answer is read out. Because this is the same fixed-size matrix read over and over, the system can chain associations that were demonstrated separately. The lab's central task demonstrates this directly: six demonstrations teach two chains of association — symbol -> intermediate, and intermediate -> final — with the direct symbol -> final pair never shown at all. At one latent step, the system reaches only the intermediate symbol. At two latent steps, using the exact same demonstrations and the exact same matrix, it reaches the correct final answer. Nothing about the state changed size to make that possible; only the number of times it was read did.

Beside every query, the lab runs a baseline: a small, honest, single-hop attention lookup over the demonstrated pairs, with an explicit cache that grows by two entries for every demonstration. On the chained task, the baseline is structurally unable to do better than the synaptic model's one-step answer — it has no recurrence, so it retrieves the first hop and stops there, regardless of how the query is repeated. That contrast — a state that stays fixed in size while gaining reasoning depth through repetition, against a cache that grows with evidence but gains no depth — is the entire content of the claim, made observable rather than asserted.

## BDH's role

The reference architecture is Dragon Hatchling (BDH), described by its authors as an architecture positioned between the Transformer and biological models of computation, using a fixed-size recurrent state, local Hebbian-style synaptic updates, and sparse, non-negative activations, in contrast to a Transformer's dense activations and growing attention cache. This lab's toy model is built in that spirit, and its equations are deliberately labeled as this lab's own simplification — not a port of BDH's actual formulation, which involves mechanisms (such as its expansion representation and its treatment of attention as a form of Hebbian learning) that a legible, eight-symbol toy model does not attempt to reproduce. The in-app "Where this appears in BDH" module maps each observable behavior in this lab to the corresponding general BDH concept, and links to the primary sources for the real equations.

## The main limitation

The synaptic model in this lab has no mechanism for generalization. It can only retrieve associations it has literally been shown; it cannot infer a pattern (such as "shift by three") and apply it to a symbol whose specific pairing was never demonstrated. Query a symbol whose association was never placed in the demonstration pool, and the honest result is "no confident association" — not a guess. This is not a bug being apologized for; it is a direct consequence of using symbol identity as the representation, chosen deliberately so that every synapse stays inspectable. Repeated latent refinement compounds evidence that is already in the matrix — it cannot substitute for evidence that was never written in. Whether and how the BDH family generalizes beyond literally demonstrated associations at larger scale is a question for the primary sources, not for this toy model, which is an illustration of one mechanism, not a benchmark result about BDH itself.

## Try it

The guided walkthrough (`Begin the walkthrough`) reaches this insight in under ninety seconds, ending with the same chained-association task, side by side with the baseline. The sandbox (`Jump to laboratory`) lets you rerun it with any of the three tasks, any query, and any combination of plasticity rate, demonstration count, and latent-step count — including the two failure modes described in the in-app Limitations section.
