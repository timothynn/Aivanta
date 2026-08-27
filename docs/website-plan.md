# Aivanta Website Implementation Plan

## 1. Product goal

Build a focused marketing website for Aivanta that explains one idea clearly:

> **Turn software into intelligent software.**

The site should make Aivanta feel like an engineering-led AI consultancy that modernizes existing software rather than a generic chatbot or prompt agency.

## 2. Recommended stack

### Frontend

- React
- TypeScript
- Vite
- CSS with design tokens and responsive layouts

React + Vite keeps the first version fast, simple, portable, and easy to deploy as a static site.

### Hosting

Start with GitHub Pages because the repository is already on GitHub and the site is initially a static marketing experience. Vite documents GitHub Actions deployment for Vite sites, and GitHub Pages supports custom domains.

Keep the app architecture independent of hosting so it can later move to Vercel, Cloudflare Pages, or another platform without a rewrite.

## 3. Information architecture

### Homepage

1. Hero
2. The problem: useful business software is often disconnected from modern AI
3. The Aivanta approach
4. Services
5. How transformation works
6. Industries
7. Example transformation patterns
8. Why Aivanta
9. Call to action
10. Footer

### Services

- AI Application Assessment
- AI Integration
- Agentic Workflows
- Enterprise Knowledge & Document Intelligence
- AI Modernization

### Approach

Discover → Identify → Integrate → Validate → Deploy → Improve

### About

Keep this intentionally human and concise. Explain the engineering-led approach and cross-domain experience without exposing client or employer confidential information.

### Contact

Start with a simple consultation/assessment CTA. Avoid building a custom backend contact form until there is a real operational need. A mailto or managed form service can be introduced later.

## 4. Visual direction

The brand should feel:

- Professional
- Calm
- Technical
- Modern
- Trustworthy
- Enterprise-ready

Avoid the visual language of generic AI startups: glowing brains, robots, excessive gradients, neon cyberpunk styling, and cluttered dashboards.

Use restrained motion, strong typography, generous whitespace, subtle data/connection motifs, and a clear visual hierarchy.

## 5. Initial technical structure

```text
src/
├── components/
├── sections/
├── assets/
├── styles/
├── App.tsx
└── main.tsx

public/

.github/
└── workflows/
    └── deploy.yml

docs/
├── brand/
│   └── logo-prompt.md
└── website-plan.md
```

Keep components small and reusable, but avoid overengineering a one-page marketing site.

## 6. Implementation sequence

### Phase 1 — Foundation

- Initialize React + TypeScript + Vite
- Establish typography and design tokens
- Add favicon/metadata scaffolding
- Add the Aivanta logo assets once generated
- Build the base layout and navigation

### Phase 2 — Core experience

- Implement hero section
- Build services section
- Build transformation/process section
- Build industries section
- Build credibility/about section
- Add primary CTA

### Phase 3 — Polish

- Responsive behavior for desktop, tablet, and mobile
- Keyboard navigation
- Focus states
- Semantic HTML
- Reduced-motion support
- Image optimization
- Open Graph and social metadata
- Sitemap and robots.txt

### Phase 4 — Deployment

- Add GitHub Pages Actions workflow
- Configure repository Pages source to GitHub Actions
- Verify the production build
- Add custom domain when the domain is purchased
- Verify HTTPS and redirect behavior

### Phase 5 — Growth

- Add case studies using only public or explicitly permitted material
- Add a lightweight contact/lead capture flow
- Add analytics with privacy considerations
- Add a resources/insights section
- Add industry-specific landing pages once there is evidence of demand

## 7. Initial success criteria

The first public release should answer these questions within seconds:

1. What is Aivanta?
2. Who is it for?
3. What does it actually do?
4. Why should a company work with it?
5. What is the next step?

The site should also remain safe for a consultancy operating alongside other professional employment: no employer-confidential examples, proprietary architecture, customer data, or internal project details.
