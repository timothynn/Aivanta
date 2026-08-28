# Aivanta Knowledge Retrieval

Aivanta uses a small curated knowledge base for company-specific assistant answers.

## Retrieval modes

### Keyword (default)

`AI_RETRIEVAL=keyword`

Fast, deterministic, and requires no additional AI API call. This is the recommended local/development default.

### Semantic

`AI_RETRIEVAL=semantic`

When `OPENAI_API_KEY` is configured, Aivanta embeds the query and the curated knowledge entries using `AI_EMBEDDING_MODEL` (default `text-embedding-3-small`) and ranks entries by cosine similarity. Embeddings are cached in memory for the process lifetime and the system falls back to keyword retrieval when semantic retrieval is unavailable.

This is intentionally a small-step semantic layer. It avoids introducing a vector database while the knowledge corpus is small. A future larger corpus can move the same interface to PostgreSQL + pgvector or another vector store without changing the assistant UI or public API.

## Recommended production configuration

```text
OPENAI_API_KEY=<server-side secret>
AI_VENDOR=openai
AI_RETRIEVAL=semantic
AI_EMBEDDING_MODEL=text-embedding-3-small
```

Never expose provider keys in the frontend. The browser only calls Aivanta's `/api/chat` endpoint.

## Grounding rules

The assistant is instructed to treat retrieved Aivanta content as trusted company context and not invent services, customers, testimonials, prices, integrations, or outcomes. Retrieval should remain a support mechanism, not an authority to override application policy or visitor input.
