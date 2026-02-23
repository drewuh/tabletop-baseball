# Tabletop Baseball — Portfolio Project

## Project Overview

A baseball simulation based on the rules of Strat-o-matic baseball using fictional teams and player names, meant to showcase:

- Clean modern UI/UX using React + TypeScript
- Node.js backend
- SQLite database for storing teams, players, and their statistics

**Developer:** Andrew Moyer  
**Stack:** React + TypeScript (frontend), Node.js (backend), SQLite (database)

---

## Architecture

```
tabletop-baseball/
├── backend/                  # Node.js
│   ├── server.ts
│   ├── routers/
│   ├── models/
│   ├── seeds/                # All team, player, and game seed data lives here
│   └── .env                  # NEVER commit this
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── ...
├── .claude/
│   ├── agents/
│   └── commands/
└── CLAUDE.md
```

---

## Core Rules — Always Follow These

- NEVER commit `.env` files or API keys to git
- Use TypeScript strict mode — no `any` types
- Prefer functional React components with hooks
- Create a new feature branch before coding; commit often with clear messages

---

## Code Style

| Context | Convention | Example |
|---|---|---|
| TypeScript | interfaces over types, named exports, no default exports except pages | `export interface Player {}` |
| CSS | Tailwind utility classes only — no custom CSS files unless absolutely necessary | `className="flex gap-4"` |
| Component files | PascalCase | `GameBoard.tsx` |
| Node.js files | camelCase | `gameRouter.ts` |

---

## Environment Variables

**Backend `.env`** (never committed):

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=./db/tabletop.db
```

---

## Commands to Know

```bash
# Backend
cd backend && npm install
npm run dev

# Frontend
cd frontend && npm install
npm run dev
```

---

## Agent Roles

This project uses three specialist Claude Code agents. Always invoke them in order:

1. **`project-manager`** — defines features, acceptance criteria, and user stories
2. **`ux-designer`** — designs UI/UX, component structure, color, and typography
3. **`frontend-dev`** — implements React components, manages state and styling

When starting any new feature, invoke `project-manager` first, then `ux-designer`, then `frontend-dev`. This mirrors a real product team workflow.

---

## Gameplay Overview

Strat-o-matic is a dice-based baseball simulation. Each at-bat is resolved by rolling 3 dice:

- **1d20** — selects the player card (1–10 = batter's card, 11–20 = pitcher's card)
- **2d6** — selects the result by column and row on that card

Possible results include: single, double, triple, home run, walk, strikeout, ground out, fly out, etc. The CPU manages the opposing team using basic strategy logic.

---

## UI/UX Vision

This should feel like a real baseball experience — not a spreadsheet:

- Animated 3D dice roll on every human at-bat
- Player card displayed during each at-bat (pitcher vs. batter)
- Stadium-style scoreboard showing inning-by-inning runs
- Baseball diamond with live base runner indicators
- All teams and players are fictional — no MLB intellectual property

---

## What NOT to Do

- Don't scaffold boilerplate without reading this file first
- Don't install packages without adding them to `package.json`
- Don't hardcode player names, team names, or game data inline — all seed data lives in `/backend/seeds/`
- Don't put business logic in React components — use custom hooks
- Don't skip TypeScript types to "save time"

---

## Start Here

Before writing any code:

1. Read this entire file
2. Invoke the `project-manager` agent to produce a phased feature roadmap
3. Invoke the `ux-designer` agent to produce a component map and visual spec
4. Confirm both artifacts with me before touching any code

---

## Session Status

**Current branch:** `feature/phase-2-visual-polish`
**Last updated:** 2026-02-22 (night)

### Phase 2 — Visual Polish

#### Done
- **Animated 3D dice** — `Die.tsx` + `dice.css`: 3 roll variants (A/B/C), randomized duration, spring-settle bounce, team accent border on landed face
- **D6/D20 cube unification** — both dice use the identical `.dice-cube` CSS shape; D20 is identified by its label only
- **Player cards at at-bat** — `PlayerCard.tsx`: pitcher and batter cards side-by-side, active row highlighted, team-color header tint
- **Stadium scoreboard** — `Scoreboard.tsx`: inning-by-inning grid, R/H/E totals, LIVE pulse indicator, FINAL state, team accent colors per row
- **Baseball diamond** — `DiamondView.tsx`: occupied bases pulse in team accent color, outs indicator
- **Team color theming** — `teamThemes.ts` + `useTeamTheme` hook, wired throughout `GamePage` (scoreboard, diamond, player cards, dice)
- **TeamSelectPage** — `TeamCard` shows per-team color identity (badge, border tint, selected ring); `ConfirmTeamButton` adopts selected team's `primaryHex`; page title polished with eyebrow label + separator

- **GameResultPage** — `ResultBanner` uses `playerTheme.primaryHex` for win (solid) and loss (60% overlay on `bg-red-950`); `Scoreboard` receives `homeTheme`/`awayTheme` and `phase="complete"` activating the FINAL label
- **6×6 D6 matrix** — at-bat resolution migrated from 1D sum (11 outcomes) to true col×row grid (36 cells/card); `PlayerCard` redesigned as a 6×6 grid; stale-rollResult highlight bug fixed in `AtBatPanel`

#### Remaining (Phase 2)
- **Theme coverage** — only 4 entries in `teamThemes.ts`; verify IDs match DB team IDs exactly (quick check, not a full feature)

#### Phase 2 gate
Do not merge to `main` or start Phase 3 until theme coverage is verified.