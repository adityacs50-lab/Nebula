# Nebula

**The shared AI brain for founding teams.**

Your co-founder is on ChatGPT. You're on Gemini. Nobody knows what the AI told who. Nebula fixes that: one infinite multiplayer canvas where every AI prompt and output lives in one shared space — and the AI has full context of everything the whole team is working on.

## What's inside

- **Infinite multiplayer canvas** — react-flow canvas with live cursors, presence, and shared state via Liveblocks. Join with an invite link and you're in the same room.
- **Canvas-aware AI** — every Gemini API call (`gemini-2.5-flash`) is injected with a live snapshot of the entire canvas (`lib/canvas/context.ts`), so the AI knows what every teammate is building right now.
- **Six block types** — AI Chat (streaming, markdown-rendered), Generate Code (Gemini-powered, syntax highlighted), AI Image (Gemini-powered generation), User Flow (nested react-flow), API Integration, and Mind Map.
- **Auth + persistence** — Supabase auth (email/password + Google OAuth), workspaces, members, invites, and RLS policies.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-flow · Liveblocks · Supabase · Gemini API · Framer Motion · Zustand · highlight.js

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
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) → Create API key |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL` | [supabase.com/dashboard](https://supabase.com/dashboard) → your project → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Same page → Project API keys → `publishable` |
| `SUPABASE_SECRET_KEY` | Same page → Project API keys → `secret` (server-only; keep private) |
| `SUPABASE_JWKS_URL` | Your project URL plus `/auth/v1/.well-known/jwks.json` |
| `LIVEBLOCKS_SECRET_KEY` | [liveblocks.io/dashboard](https://liveblocks.io/dashboard) → your project → API keys → Secret key (`sk_...`) |
| `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` | Same page → Public key (`pk_...`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally; your production URL on Vercel |

**Getting the keys, step by step:**

- **Google Gemini** — create an API key at aistudio.google.com, then add it to your environment as `GEMINI_API_KEY`. The AI chat and code generation blocks call `gemini-2.5-flash` through `/api/ai/chat` and `/api/ai/code`; the AI image block calls `gemini-2.5-flash-image` through `/api/ai/image` (with automatic fallback to older image-capable model names).
- **Supabase** — create a free project at supabase.com. Grab the project URL, publishable key, secret key, and JWKS URL from Project Settings → API. To enable Google login, go to Authentication → Providers → Google and add your Google OAuth client credentials.
- **Liveblocks** — create a free project at liveblocks.io. Both the secret key (used by `/api/liveblocks/auth`) and the public key are on the project's API keys page.

> Nebula degrades gracefully: without keys it boots in demo mode (auth is skipped, the canvas shows a connecting state until Liveblocks keys are added, and AI routes return a friendly configuration message).

### 3. Database schema

**Easiest:** open your Supabase project → SQL Editor → paste the whole of `supabase/setup.sql` → Run. It's idempotent (safe to run twice) and covers every migration. If the app ever shows "Could not find the table 'public.…' in the schema cache", this step is what's missing.

Or apply the migrations in `supabase/migrations/` in order via the CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This creates `workspaces`, `workspace_members`, `blocks`, `connections`, and `invites` with row-level security so users only see workspaces they belong to, plus a uniqueness constraint on `workspace_members(workspace_id, user_id)` so re-opening an invite link never creates a duplicate membership row.

**Invite links** (`Share → Invite teammates` in the canvas topbar, or `/api/workspace/invite`) mint a row in `invites` with a random `token` and a 7-day `expires_at`, scoped by RLS so only existing workspace members can create one. Opening `/invite/[token]` verifies the token with the **service role** key (`SUPABASE_SERVICE_ROLE_KEY`) — the invitee isn't a workspace member yet, so the normal RLS-scoped client can't see the invite row — then adds them to `workspace_members` and redirects to the canvas. Invalid, expired, or already-used-by-someone-else tokens render an error page instead of redirecting.

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

- `lib/canvas/context.ts` — the core differentiator. `buildCanvasContext()` snapshots every block (chats, code, flows, mind maps), who edited it, and recent activity. `hooks/useAI.ts` injects that snapshot into **every** Gemini call.
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
