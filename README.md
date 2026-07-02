# Nebula

**The shared AI brain for founding teams.**

Your co-founder is on ChatGPT. You're on Claude. Nobody knows what the AI told who. Nebula fixes that: one infinite multiplayer canvas where every AI prompt and output lives in one shared space — and the AI has full context of everything the whole team is working on.

## What's inside

- **Infinite multiplayer canvas** — react-flow canvas with live cursors, presence, and shared state via Liveblocks. Join with an invite link and you're in the same room.
- **Canvas-aware AI** — every Claude API call (`claude-sonnet-4-6`) is injected with a live snapshot of the entire canvas (`lib/canvas/context.ts`), so the AI knows what every teammate is building right now.
- **Six block types** — AI Chat (streaming), Generate Code (Claude-powered, syntax highlighted), AI Image, User Flow (nested react-flow), API Integration, and Mind Map.
- **Auth + persistence** — Supabase auth (email/password + Google OAuth), workspaces, members, invites, and RLS policies.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-flow · Liveblocks · Supabase · Claude API · Framer Motion · Zustand · highlight.js

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
| --- | --- |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → Settings → API Keys → Create Key |
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com/dashboard](https://supabase.com/dashboard) → your project → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → Project API keys → `service_role` (keep secret) |
| `LIVEBLOCKS_SECRET_KEY` | [liveblocks.io/dashboard](https://liveblocks.io/dashboard) → your project → API keys → Secret key (`sk_...`) |
| `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | Same page → Public key (`pk_...`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally; your production URL on Vercel |

**Getting the keys, step by step:**

- **Anthropic** — create an account at console.anthropic.com, add billing, then Settings → API Keys → "Create Key". The AI chat and code generation blocks call `claude-sonnet-4-6` through `/api/ai/chat` and `/api/ai/code`.
- **Supabase** — create a free project at supabase.com. Grab the URL and both keys from Project Settings → API. To enable Google login, go to Authentication → Providers → Google and add your Google OAuth client credentials.
- **Liveblocks** — create a free project at liveblocks.io. Both the secret key (used by `/api/liveblocks/auth`) and the public key are on the project's API keys page.

> Nebula degrades gracefully: without keys it boots in demo mode (auth is skipped, the canvas shows a connecting state until Liveblocks keys are added, and AI routes return a friendly configuration message).

### 3. Database schema

Apply the migration in `supabase/migrations/001_initial.sql`:

- **Option A (dashboard):** open your Supabase project → SQL Editor → paste the file → Run.
- **Option B (CLI):**
  ```bash
  npx supabase login
  npx supabase link --project-ref <your-project-ref>
  npx supabase db push
  ```

This creates `workspaces`, `workspace_members`, `blocks`, `connections`, and `invites` with row-level security so users only see workspaces they belong to.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, and you'll land on your first canvas. Open the same workspace URL in a second browser to see live cursors.

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the repo at [vercel.com/new](https://vercel.com/new) — `vercel.json` is already configured. Then:

1. Add all the environment variables from `.env.local` in Vercel → Project → Settings → Environment Variables.
2. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://nebula-yourteam.vercel.app`).
3. In Supabase → Authentication → URL Configuration, add your production URL to the redirect allowlist (for Google OAuth).
4. Redeploy. Done — one command, fully live.

## Project structure notes

- `lib/canvas/context.ts` — the core differentiator. `buildCanvasContext()` snapshots every block (chats, code, flows, mind maps), who edited it, and recent activity. `hooks/useAI.ts` injects that snapshot into **every** Claude call.
- `lib/liveblocks/config.ts` — typed Presence (cursors, active block) + Storage (`LiveList<Block>`, `LiveList<Connection>`).
- `app/api/liveblocks/auth/route.ts` — verifies the Supabase session and mints a Liveblocks token with the user's name and cursor color.
- `next.config.mjs` — Next.js 14 doesn't support `next.config.ts` (that arrived in Next 15), so the config lives in `.mjs` form with identical contents.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Strict TypeScript check (`tsc --noEmit`) |
