# Contributing to T&J's Tackle

## Standards

- **Conventional Commits** — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- **TypeScript strict** everywhere in app code.
- **Formatting/linting** — ESLint + the framework defaults; keep CI green.
- **Original work only** — never copy competitors' protected lure designs, brand
  assets, or copy. All shapes, colors, and names must be original to T&J's Tackle.

## Branching

- Feature branches off the default branch: `feat/<short-name>`.
- Open a **draft PR** early; fill in the PR template.
- One reviewer approval + green CI before merge.

## Local development

```bash
npm install
npm run dev          # website at http://localhost:3000
npm run typecheck
npm run build
npm run db:validate  # validate the Prisma schema
```

## Adding a new app or package

Drop it in `apps/*` or `packages/*` with its own `package.json` named
`@jt/<name>`. Keep interfaces clean so modules stay independently deployable.

## Definition of done

- Type-checks and builds.
- Docs updated (README/roadmap/relevant `docs/*`).
- No secrets committed; use `.env.example` for config shape.
- Answers at least one of the six core product questions in the README.
