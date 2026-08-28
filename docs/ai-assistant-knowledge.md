# Aivanta Assistant Knowledge

The public Aivanta assistant is grounded in a curated knowledge layer before provider-specific generation.

## Current approach

The knowledge set is stored in `server/knowledge/aivantaKnowledge.ts` and retrieved using a lightweight keyword scorer. Matching entries are added to the model's trusted instructions for the current turn.

This intentionally avoids a vector database at the current stage. The goal is to keep the consultancy demo simple, deterministic, cheap to operate, and easy to edit while the service proposition is still evolving.

## Knowledge categories

- Aivanta positioning
- AI transformation assessment
- AI integration
- Agentic workflows
- Document and knowledge intelligence
- Responsible AI
- Engagement paths
- Industries

## Next RAG evolution

When the content volume or client-facing knowledge requirements justify it, replace the keyword scorer with embeddings and a vector store. Keep the public `retrieveKnowledge()` contract stable so the assistant providers do not need to change.

## Content governance

Only publish claims Aivanta can substantiate. Do not put client-confidential information, employer-confidential information, unpublished client work, credentials, or internal system details into this knowledge layer.
