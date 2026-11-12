# X Clone Engineering

A frontend for an X (Twitter)-style app. The API is already deployed — this repo is
frontend-only, living under `src/frontend/`. The stories to build are already written and on
the board.

## The backlog and the board

- `docs/` holds the backlog (slug `x-clone-v3`): the idea, the
  PRD (`R1…` Must Have, `N1…` Nice to Have, `NF1…` non-functional), the epics and one stories file
  per epic. Every epic and story heading has a `**Work Item:** [XC-n](…)` key.
  `docs/handoff/x-clone-v3-handoff.md` records which version of the stories this is.
- **Never edit the story, epic or PRD text.** It belongs to the product owner. A wrong or missing
  story is a question for the product owner, not an edit here.
- The board is `board.html`, served live by `board-server.mjs` (`pnpm board`, port in
  `.board-server.json`, default 4000). Its six states are **New → In Progress → In Review → In QA
  → In Acceptance → Done**. Change a ticket only through the server's API
  (`POST /api/items/<KEY>/status`, `/comments`, `/attachments`), never by editing
  `docs/tracker/board-data.js` while the server runs. Skills never move a ticket to **Done**:
  acceptance is a person's decision on the board.
- NF requirements that no story covers (in x-clone-v3: NF5–NF8) are constraints on every story.

## End-to-end tests (Playwright)

- `src/frontend/e2e/`, run against the dev server and the shared API, signed in as the person
  (`pnpm e2e:login` saves the session to `e2e/.auth/user.json`; never sign in or handle a
  password yourself).
- One spec per story: `e2e/<key>.spec.ts` (for example `xc-8.spec.ts`), with one test per
  acceptance criterion named `AC<n>: <criterion>`. Import `test` and `expect` from `./fixtures`,
  and wrap user actions in `evidence.step("…", …)`, whose captions show in the QA videos.
- Two projects run the same tests: `verify` (`pnpm e2e`, fast) and `evidence`
  (`pnpm e2e:evidence`, human-paced, one video per test, results in `test-results/results.json`).
- Never weaken, skip or delete a test to get green. Every earlier story's spec is part of the
  regression suite.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **TanStack Router** — file-based routing (`src/frontend/src/routes/`)
- **TanStack Query** — server state / data fetching
- **Tailwind CSS v4** + shadcn-style primitives in `src/frontend/src/components/ui/`
- **better-auth** (React client) for authentication
- **Vitest** + `@testing-library/react` for tests

## Structure

```
src/frontend/src/
  routes/          File-based routes (TanStack Router). `_app.tsx` and `_auth.tsx` are
                   pathless layout routes — `_app` requires a signed-in session,
                   `_auth` requires a signed-out one (see their `beforeLoad` guards).
  components/
    ui/            Generic, feature-agnostic primitives (button, dialog, form, ...)
  hooks/           Reusable React hooks
  lib/             Framework-agnostic utilities (auth client, formatting, session query)
  stores/          Client-side state outside React Query (currently: theme)
```

## Conventions

- **Routing**: add a new page by adding a file under `src/frontend/src/routes/`. Auth-gated
  pages go under `_app/`; the layout at `src/frontend/src/routes/_app.tsx` renders the
  header/nav shared by all of them. `routeTree.gen.ts` is generated — never edit it by hand, it
  regenerates on `pnpm dev`/`pnpm build`.
- **Data fetching**: API calls live in `src/frontend/src/queries/<domain>.ts` (a directory you'll
  create) as plain `fetch` calls wrapped in `queryOptions(...)` (see `lib/session.ts` for the
  pattern). Always pass `credentials: "include"` — auth is cookie-based.
- **Auth**: `lib/auth-client.ts` wraps `better-auth/react`; `lib/session.ts` exposes
  `sessionQueryOptions` for reading the current session via React Query.
- **Env config**: the API base URL is read from `VITE_API_URL` (see
  `src/frontend/.env.example` and `src/frontend/vite.config.ts`'s `/api` proxy) — never hardcode
  the API origin in application code.

## The @xbot assistant

- `@xbot` is an assistant account on the shared API. Mentioning it in a tweet
  (`/(^|\s)@xbot\b/i` — the rule lives in `src/frontend/src/lib/xbot.ts`, and the backend uses
  the same one) means it should answer in that tweet's thread.
- `POST /api/tweets/:id/xbot-reply` with `{ content }` posts a reply as `@xbot`, where `:id` is
  the tweet that mentioned it. Only that tweet's author may call it (`403`), it must mention
  `@xbot` (`400`), and each mention is answered once (`409` after that).
- A mention inside a reply continues the thread: replies are single-level, so the answer is
  posted as that reply's **sibling** under the same original tweet. The API derives the parent
  itself — callers never send one.
- **The API never calls a model** — it only stores the answer. The answer itself is written
  locally by `vite-plugin-xbot.ts`, a dev-only Vite plugin that serves `POST /__xbot/answer`
  by shelling out to the `claude` CLI. So the feature needs no API key, and `@xbot` goes quiet
  when the dev server isn't running. A failed call to `/__xbot/answer` means "@xbot is asleep":
  show a quiet message, never post a placeholder reply to the shared API.

## Workshop note

- The API is shared by everyone in the room. When testing in the browser (including via
  Playwright), sign in with your own account — sign up if you haven't — never a shared one.
  Likes, retweets, and follows are per-account state shared live with whoever else is using
  that account.

## Commands (run from `src/frontend/`)

- `pnpm dev` — start the dev server
- `pnpm board` — start the board server (http://localhost:4000)
- `pnpm build` — typecheck + production build
- `pnpm lint` — ESLint
- `pnpm test` — Vitest
- `pnpm e2e:login` — save your sign-in for the end-to-end tests (once)
- `pnpm e2e [spec]` — end-to-end tests, fast (`verify`)
- `pnpm e2e:evidence [spec]` — end-to-end tests at human pace, with a video per test
