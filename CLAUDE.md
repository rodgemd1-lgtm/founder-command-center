# Founder Command Center — Project Brain

## What This Is
A web-based startup operating system for managing Mike's multi-business portfolio.
Deployed on Vercel, backed by Supabase. The intelligence layer for all 4 businesses.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Backend:** Supabase (Auth, PostgreSQL, Edge Functions, RLS, Vault)
- **Hosting:** Vercel (auto-deploy from GitHub)
- **AI:** Claude API via Supabase Edge Functions (when configured)
- **Testing:** Vitest + Testing Library

## Architecture
```
founder-command-center/
├── src/
│   ├── components/layout/   # AppShell, Sidebar
│   ├── pages/               # Dashboard, Business, Intelligence, Council, Vault, Notes
│   ├── lib/                 # data.ts (business data), council.ts (agents), utils.ts, supabase.ts
│   ├── types/               # TypeScript interfaces
│   └── __tests__/           # Vitest test suites
├── supabase/migrations/     # Database schema
├── vercel.json              # SPA routing + caching
└── CLAUDE.md                # You are here
```

## Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | All 4 businesses at a glance — metrics, progress, blockers |
| `/business/:slug` | BusinessDetail | Deep dive: domain grid, blockers, weekly focus |
| `/intelligence` | Intelligence | Search/filter 50+ personas, frameworks, skills |
| `/council` | Council | AI advisory board — 7 agents with chat interface |
| `/vault` | Vault | API keys, credentials, .env export |
| `/notes` | Notes | Meeting notes, ideas, tagged by business |

## Design System
- **Background:** slate-950 (#020617)
- **Surface layers:** surface-0 → surface-3 (slate-950 → slate-700)
- **Accent:** brand-500 (amber-500, #f59e0b)
- **Typography:** Inter (body), JetBrains Mono (code)
- **Components:** glass surfaces, glow-brand shadows, animate-fade-in

## Data Sources
- `src/lib/data.ts` — Business metrics and intelligence items (hardcoded, sync to Supabase later)
- `src/lib/council.ts` — 7 council agent definitions
- `localStorage` — Vault entries and notes (pre-Supabase)

## Environment Variables
```
VITE_SUPABASE_URL=         # Supabase project URL
VITE_SUPABASE_ANON_KEY=    # Supabase anonymous key
```

## Commands
```bash
npm run dev          # Start dev server
npm run build        # TypeScript check + Vite build
npm test             # Run vitest
vercel --prod        # Deploy to production
```

## Code Standards
- Strict TypeScript (no `any`, no unused vars)
- `import type` for type-only imports (verbatimModuleSyntax)
- No enums (erasableSyntaxOnly) — use const objects or union types
- Path alias: `@/` → `src/`
- All tests in `src/__tests__/`
