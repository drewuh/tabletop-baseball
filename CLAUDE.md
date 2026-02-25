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

**Current branch:** `feature/phase-4-reach-authorship`
**Last updated:** 2026-02-24

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

#### Phase 2 gate — CLEARED
Theme coverage verified: all 4 `teamThemes.ts` keys match DB team IDs exactly.

---

### Phase 3 — Memory (Persistent Stats & Records)

#### Done
- **player_stats + team_season_record tables** — schema updated; stats written per at-bat; games_played and W-L updated at game completion
- **statsRouter** — `GET /api/stats/batting`, `GET /api/stats/pitching` (LEFT JOIN so all players appear with 0s)
- **Game history endpoint** — `GET /api/games` returns completed games with final scores
- **`GET /api/teams`** — now includes `wins` and `losses` per team
- **Clean slate** — Phase 1/2 test game data wiped before Phase 3 landed
- **NavBar** — persistent top nav: Home / Stats / History, active-route highlight
- **/stats page** — `StatsTabBar` + `StatsTable`: sortable batting and pitching leaders; AVG shows `—` for 0 AB; IP displayed as X.Y
- **/history page** — `GameHistoryList` + `GameHistoryRow`: scores, dates, winner highlighted green, links to result
- **TeamSelectPage two-step flow** — step 1: pick your team (click advances); step 2: pick CPU opponent; Back clears both
- **TeamCard W-L record** — wins–losses shown beneath team name
- **PlayByPlayPanel** — live auto-scroll in `GamePage` (xl: third column, smaller: below AtBat); static full log on `GameResultPage`
- **GameResultPage** — "Game History" button replaces generic "Home"

#### Phase 3 gate — CLEARED
Gate verified 2026-02-24: player_stats correct (20 rows, 54 outs), BA math validated, W-L accurate, tsc clean on both packages.

---

### Phase 4 — Reach & Authorship

**Theme:** Responsive mobile layout brings the game to any device; a full CRUD editor with AI roster generation lets users build custom teams.

#### F1 — Mobile Responsive Layout (P0)
- Minimum viewport: 375px. No horizontal overflow on any page.
- Desktop layout preserved exactly — zero regression at 1280px and 1920px.
- GamePage: lineup panels collapse on mobile; diamond/at-bat/scoreboard stack vertically.
- Scoreboard: horizontal scroll on mobile.
- NavBar: hamburger or icon-only collapse on narrow viewports.
- Stats/History tables: horizontal scroll on mobile.
- Minimum 44×44px touch targets on all controls.
- Tailwind breakpoint utilities only — no new CSS files.

#### F2 — Team & Player Editor CRUD (P0)
- Routes: `/editor`, `/editor/teams/new`, `/editor/teams/:id`, `/editor/players/:id`
- Full team CRUD; auto-generated `team-{slug}` IDs; unique 3-char abbreviation; hex color validation.
- Delete blocked (409) if team has games in DB.
- Full player CRUD; same schema as seeds.
- Team requires 9 batters (C 1B 2B 3B SS LF CF RF DH) + 1 SP before selectable in TeamSelectPage.
- Player card editor: 6×6 dropdown grid, all 36 cells required per save.
- NavBar gains "Editor" link.
- `teamThemes.ts` is no longer sole source of truth — custom teams resolve colors from DB.

#### F3 — AI-Assisted Roster Generation (P1)

**Architecture decision (PERMANENT):** F3 is implemented with a **mock response** while job searching for cost control. The architecture is identical to a live implementation — swapping in a real Anthropic API call requires changing one constant and removing the mock branch. No other code changes needed.

**Answered design decisions (do not re-litigate without explicit user instruction):**

| # | Decision | Answer |
|---|---|---|
| 1 | Model | `claude-haiku-4-5-20251001` — stubbed with mock during development |
| 2 | Prompt structure | Model picks archetype per batter (power/contact/balanced/speedster); card reflects that archetype. Mock response mirrors this structure. |
| 3 | Team identity | City and team name influence generated player names and roster feel. Include in prompt even while stubbed. |
| 4 | Output format | Structured output / tool use — no free-form JSON parsing. Mock conforms to the same schema the real API would return. |
| 5 | Player IDs | Seed convention: `{abbrev}-b{n}` / `{abbrev}-p{n}` |
| 6 | Stat bounds | Batters: max 3 HR, max 4 K, min 8 total outs. Pitchers: min 12 K, max 2 HR, min 18 total outs. Mock must pass these bounds. |
| 7 | Partial failure | Full rollback on any failure — no partial rosters written. |
| 8 | MLB name filtering | Prompt-only best effort — no hard validation block. |
| 9 | Prompt location | `/backend/config/generationPrompt.ts` — editable without redeploy. |
| 10 | Rate limiting / cost logging | Log token usage to SQLite. No per-session hard limit. While stubbed, log mock token estimates so logging infrastructure is in place. |

**Route:** `POST /api/teams/:id/generate-roster` — backend only, API key never reaches browser.
**Atomic writes:** all-or-nothing transaction; structured error `{ error: string; code: 'API_ERROR' | 'VALIDATION_ERROR' | 'PARSE_ERROR' }` on failure.
**Graceful degradation:** if API key absent (or mock flag set), feature is disabled with a clear UI message — not a crash.

#### Phase 4 — Implementation Status

**Done (2026-02-24):**
- **F1 Mobile** — NavBar hamburger+drawer (sm:hidden), TeamGrid grid-cols-1 sm:grid-cols-2, GamePage lineup hidden lg:block + Lineup/Log mobile toggles, AtBatPanel flex-col sm:flex-row, PlayerCard w-full max-w-56 sm:w-56, StatsTable overflow-x-auto
- **F2 Editor CRUD** — full backend: POST/PUT/DELETE /api/teams, GET/:id/players, POST /bulk-players, GET/POST/PUT/DELETE /api/players/:id; frontend: 4 pages, 16 components (incl. CardEditor with mobile bottom sheet), 6 hooks
- **F3 AI Generation (mock)** — generationPrompt.ts config, mock endpoint (USE_MOCK=true), api_usage logging, useRosterGeneration hook, GeneratedRosterReview+SimulatedBadge
- **teamThemes fallback** — useTeamTheme accepts optional primary_color params; custom teams resolve from DB
- tsc clean on both packages

#### Phase 4 gate
- [ ] All pages render at 375px with no overflow — verified in devtools and emulator
- [ ] Desktop regression-free at 1280px and 1920px
- [x] CRUD endpoints verified: create, read, update, delete, blocked-delete (409) — 2026-02-25
- [ ] Editor enforces 9-batter + 1-SP completeness before team is selectable
- [x] Custom team colors resolve from DB — useTeamTheme fallback wired — 2026-02-25
- [x] Mock generation writes nothing on discard; bulk-players atomic write verified — 2026-02-25
- [x] `npm run build` passes in both packages with zero errors — 2026-02-25