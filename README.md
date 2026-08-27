# Aivanta

AI software consultancy focused on turning existing business applications into intelligent, AI-enabled systems.

## Positioning

> **Turn software into intelligent software.**

Aivanta helps businesses integrate practical AI capabilities into the applications, data, documents, and workflows they already rely on.

## Website direction

The website will position Aivanta as an engineering-led AI consultancy rather than a generic chatbot or automation agency.

### Core services

- AI Application Assessment
- AI Integration
- Agentic Workflows
- Enterprise Knowledge & Document Intelligence
- AI Application Modernization

### Target clients

Aivanta is intended for organizations that already have business software, structured data, documents, and established workflows, especially in complex or regulated industries.

Aviation is an area of particular domain experience, but the brand should remain broad enough to serve other industries.

## Planned website stack

- React + TypeScript
- Vite
- Modern responsive CSS
- Lightweight animation only where it improves clarity
- Static-first architecture with no backend required for the initial marketing site
- GitHub Actions for deployment
- GitHub Pages for initial hosting

Vite supports GitHub Pages deployment through a GitHub Actions workflow, and GitHub Pages supports custom domains. See the implementation plan in `docs/website-plan.md`.

## Repository structure

```text
.
├── docs/
├── public/
├── server/
│   ├── adapters/
│   ├── domain/
│   └── migrations/
├── src/
│   ├── api/
│   ├── components/
│   ├── data/
│   └── sections/
└── README.md
```

## Status

Initial brand, website, contact flow, and backend foundation. The frontend remains static-first, while the backend handles lead intake, persistence, and notification when deployed.
