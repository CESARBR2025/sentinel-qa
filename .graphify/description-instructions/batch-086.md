# Node Description Batch 87 of 87

Graphify is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "wireframes_wf_b_wireframeb": "WireframeB()" | kind=code-symbol | source=login-desing/wireframes/wf-b.jsx:L4 | neighbors=[wf-b.jsx]
- "wireframes_wf_c_wireframec": "WireframeC()" | kind=code-symbol | source=login-desing/wireframes/wf-c.jsx:L4 | neighbors=[wf-c.jsx]
- "wireframes_wf_d_wireframed": "WireframeD()" | kind=code-symbol | source=login-desing/wireframes/wf-d.jsx:L4 | neighbors=[wf-d.jsx]
- "wireframes_wf_e_wireframee": "WireframeE()" | kind=code-symbol | source=login-desing/wireframes/wf-e.jsx:L4 | neighbors=[wf-e.jsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: /Users/cesarbr/Documents/dev/sjr/seguridad_publica/.graphify/description-instructions/batch-086.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
