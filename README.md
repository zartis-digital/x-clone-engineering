# X Clone Engineering

> **Required: Claude Pro or higher.** Pro is the cheapest plan that includes Claude Code and the
> desktop app ([see current prices](https://claude.com/pricing)). For a workshop it's simpler and
> better value than buying API credits. The Free plan isn't enough.

The X Clone engineering workshop. The backlog is ready: ten user stories in four epics, with the
PRD behind them, are in `docs/` and on the team's board, all in **New**. Like a developer joining
the team, you take it from there.

You build Claude Code skills that take a story to **In Acceptance** on their own. They write a
Playwright test for every acceptance criterion, build until every test is green (including all
earlier stories' tests), get a fresh-eyes review, and post a QA video for each criterion as a
comment on the ticket. The only human step is acceptance on the board.

It's a React frontend for an X (formerly Twitter) clone that talks to a **hosted API**: you only
work on the frontend.

**Stack:** React 19 · Vite · TanStack Router · TanStack Query · Tailwind CSS v4 · shadcn/ui ·
better-auth · Vitest · Playwright

Open [`workshop.html`](workshop.html) in a browser for the full guided walkthrough. It has a
toggle for **Terminal** (Claude Code in a terminal or IDE) and **Desktop app** (the Code tab of
the Claude desktop app). The exercises are the same on both.

## The workshop, about 5 hours

| Part | What you do | Time |
|---|---|---|
| Getting started | Install, start the app and the board, save your sign-in | ~30 min |
| 1 Meet the backlog | The stories on the board, and a check that they're ready | ~15 min |
| 2 Claude Code essentials | Context and rules, plan mode, guard hooks | ~35 min |
| 3 Walk the pipeline | Build `/implement-story`, `/review-pr` and `/qa-evidence`, and use each on its own | ~90 min |
| 4 Improve & orchestrate | The factory loop (regression run, round cap), then `/implement`: one command, no gates | ~65 min |
| 5 The small factory | `/implement --epic 3`: a whole epic, unattended, to In Acceptance | ~55 min |
| 6 Take it home | What you built, and the large-codebase track | ~10 min |
| **Total** | plus breaks | **~5 h** |
| Extras | Epic 4 through the factory; an accessibility reviewer; make it yours | ~50 min + open |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ and [pnpm](https://pnpm.io/) 9+
- Git
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code), in a terminal, an IDE, or the
  Code tab of the Claude desktop app

## Setup

```sh
git clone https://github.com/zartis-digital/x-clone-engineering
cd x-clone-engineering/src/frontend
pnpm install
pnpm exec playwright install chromium
```

`src/frontend/.env` is already committed with `VITE_API_URL` pointing at the shared workshop
API, so there's nothing to set up.

Start the app and the board, each in its own terminal, from `src/frontend`:

```sh
pnpm dev      # the app, http://localhost:5173
pnpm board    # the board, http://localhost:4000
```

Sign up in the app with your **own** account (the API is shared by the whole room), then save
that sign-in for the end-to-end tests and check it works:

```sh
pnpm e2e:login                 # a browser opens: sign in there; Claude never sees your password
pnpm e2e e2e/smoke.spec.ts     # should pass
```

Launch Claude Code from the **repository root** (`x-clone-engineering/`, where `CLAUDE.md`
lives), not from `src/frontend`.

## Project structure

```
x-clone-engineering/
  CLAUDE.md
  README.md
  workshop.html            ← the workshop guide
  board.html               ← the team's board
  board-server.mjs         ← its server: live updates, comments, acceptance, an API for tools
  docs/
    ideas/ prds/ epics/ stories/   ← the PRD, epics and stories (x-clone-v3); never edit the story text
    tracker/board-data.js          ← the board's data
    handoff/                       ← which version of the stories this is
  src/frontend/            ← the app you'll work on
    e2e/                   ← Playwright tests: fixtures, sign-in, smoke, then one spec per story
    src/routes/ components/ hooks/ lib/ stores/
```

## Scripts

Run from `src/frontend/`:

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server on `:5173` |
| `pnpm board` | Start the board on `:4000` (Ctrl+C stops it) |
| `pnpm build` | Type-check and production build into `dist/` |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run the Vitest suite |
| `pnpm e2e:login` | Save your sign-in for the end-to-end tests |
| `pnpm e2e` | Run the end-to-end tests (fast, the verification loop) |
| `pnpm e2e:evidence` | Run them at human pace with one video per test (QA evidence) |

## The board

Six states: **New → In Progress → In Review → In QA → In Acceptance →
Done**. Skills move stories through the board server's API. Only a person moves one to **Done**,
with the board's Accept button. Opened straight from disk, `board.html` is read-only.
