# Aivanta Backend Design

## Goal

Keep the marketing frontend static-first while adding a small backend for stateful workflows:

- Lead intake from the contact form
- Optional assessment data
- Lead notification email
- Customer support chatbot
- Future admin review

The frontend should only know how to submit a lead. Validation, persistence, email delivery, rate limiting, and future scoring stay inside the backend.

## Runtime

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- Resend-compatible email notification

## Frontend contract

```http
POST /api/leads
Content-Type: application/json
```

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Example Co",
  "industry": "Enterprise Software",
  "message": "We want to add AI to our internal workflow.",
  "goals": ["AI integration", "Document intelligence"],
  "source": "homepage_contact_form"
}
```

Success:

```json
{
  "ok": true,
  "leadId": "uuid"
}
```

Validation error:

```json
{
  "ok": false,
  "message": "Please check the form and try again.",
  "issues": []
}
```

## Modules

`LeadIntake` is the main module. Its interface accepts unknown input and returns a lead id. The implementation validates the payload, stores it, and notifies the configured recipient.

Adapters:

- `InMemoryLeadStore` for tests
- `PostgresLeadStore` for production
- `ConsoleLeadNotifier` for local development
- `ResendLeadNotifier` for production notification
- `LocalSupportChatAssistant` for local chatbot testing
- `GeminiSupportChatAssistant` for Gemini-backed chatbot responses
- `OpenAISupportChatAssistant` for OpenAI-backed chatbot responses

## Chatbot contract

```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "messages": [
    { "role": "user", "content": "Can you help us add AI to our document workflow?" }
  ]
}
```

Success:

```json
{
  "ok": true,
  "message": {
    "role": "assistant",
    "content": "Aivanta can help assess and integrate that workflow..."
  }
}
```

## Database

The initial schema is in `server/migrations/001_init.sql`.

Primary tables:

- `leads`
- `lead_assessments`
- `email_events`
- `audit_events`

## Local development

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:api
```

Full stack:

```bash
npm run dev:full
```

Set `VITE_API_BASE_URL` for deployed frontend builds. During local Vite development, `/api` proxies to `VITE_API_PROXY_TARGET` or `http://localhost:8787`.

If `DATABASE_URL` is not set, the local API uses an in-memory lead store so the form can be tested without a database. Deployed environments should set `DATABASE_URL` and run `server/migrations/001_init.sql`.

The chatbot provider is selected with `AI_VENDOR=gemini`, `AI_VENDOR=openai`, or `AI_VENDOR=local`. Use `GEMINI_API_KEY`/`GEMINI_MODEL` for Gemini, `OPENAI_API_KEY`/`OPENAI_MODEL` for OpenAI, or the generic `AI_API_KEY`/`AI_MODEL` pair if a deployment platform manages secrets that way. If no provider key is set, use `AI_VENDOR=local` for deterministic local testing.
