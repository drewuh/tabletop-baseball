# Tabletop Baseball

A Strat-o-matic-style baseball simulation built with React, Node.js, and SQLite — featuring animated 3D dice, a full CRUD team editor, AI-assisted roster generation, and persistent stats across games.

**[Play it live →](https://tabletop-baseball.vercel.app)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-deployed-7B3FF2)

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://tabletop-baseball.vercel.app |
| Backend API | https://tabletop-baseball.fly.dev |

No login required — pick two teams and play a full 9-inning game. Stats and game history persist across sessions.

---

## Features

- **Animated 3D dice** — D6 and D20 with spring-settle physics and per-team accent color theming
- **Pitcher vs. batter player cards** — 6×6 outcome matrix with active row highlighted live during each at-bat
- **Stadium scoreboard** — inning-by-inning grid, R/H/E totals, LIVE pulse indicator, FINAL state
- **Baseball diamond** — pulsing base runner indicators and outs counter update in real time
- **Persistent leaderboards** — sortable batting and pitching stats backed by SQLite, survive across games
- **Game history** — full log of completed games with scores, dates, and winner highlights
- **CRUD team/player editor** — create custom teams with hex colors, edit all 36 cells of each player's outcome card
- **AI-assisted roster generation** — generates a full named roster from a city + team name; architecture is production-ready (see below)
- **Fully responsive** — down to 375px using Tailwind breakpoints only; no custom CSS files

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + TypeScript | Strict mode; functional components + custom hooks |
| Styling | Tailwind CSS | Utility classes only — no custom CSS files |
| Backend | Node.js + Express | TypeScript; modular router structure |
| Database | SQLite via `better-sqlite3` | Persistent volume on Fly.io |
| AI | Anthropic Claude (`claude-haiku-4-5`) | Mocked for cost control; production-ready architecture |
| Hosting | Vercel (frontend) + Fly.io (backend) | Auto-deploys from `main` |

---

## How the Game Engine Works

Each at-bat is resolved by rolling three dice — the same mechanic as Strat-o-matic:

1. **1d20** — determines whose card controls the at-bat (1–10 = batter's card, 11–20 = pitcher's card)
2. **2d6** — selects a column (die 1) and row (die 2) on the chosen card

Every player card is a **6×6 outcome matrix** — 36 cells seeded with stat-weighted results at roster creation time. Possible outcomes: single, double, triple, home run, walk, strikeout, ground out, fly out, and more. Stat bounds are enforced at generation: batters max out at 3 HR and 4 strikeouts; pitchers must have at least 12 strikeouts and 18 total outs per card.

The CPU manages the opposing team using basic strategy logic. All game state lives in the backend; the frontend is purely reactive.

Engine lives in `backend/src/routers/` and `backend/src/models/`. Business logic never touches React components — that rule is enforced by keeping all state and data-fetching in custom hooks.

---

## CRUD Editor + AI Roster Generation

### Team & Player Editor

Routes: `/editor`, `/editor/teams/new`, `/editor/teams/:id`, `/editor/players/:id`

- Create teams with a city, name, 3-char abbreviation, and custom hex colors
- Edit all 36 cells of each player's outcome card via an inline dropdown grid
- Delete protection: teams with existing games return a `409` — history is preserved
- Completeness gate: a team must have 9 positional batters (C 1B 2B 3B SS LF CF RF DH) and 1 SP before it appears in team selection
- Custom team colors resolve from the database — `teamThemes.ts` is a fallback for the four seed teams only

### AI Roster Generation

`POST /api/teams/:id/generate-roster` generates a complete named roster — player names, positions, and a full 6×6 outcome card per player — given nothing but a city and team name.

The architecture is production-ready:
- Structured output via Anthropic tool use — no free-form JSON parsing
- Atomic writes: the entire roster is written in a single transaction or rolled back completely
- The API key never leaves the backend
- Token usage is logged to a SQLite `api_usage` table
- **Swapping from mock to live requires changing one constant** in `backend/src/config/generationPrompt.ts` — no other code changes needed

The mock is on by default (`USE_MOCK=true`) for cost control during job searching. The `SimulatedBadge` component makes this visible in the UI.

---

## Architecture

```
tabletop-baseball/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routers/          # teamsRouter, gamesRouter, playersRouter, statsRouter
│   │   ├── models/           # game engine, stat tracking
│   │   ├── seeds/            # all team, player, and card data — never hardcoded inline
│   │   └── config/
│   │       └── generationPrompt.ts   # AI prompt — editable without redeploy
│   └── db/
│       └── tabletop.db       # SQLite (gitignored; persistent volume on Fly.io)
├── frontend/
│   └── src/
│       ├── components/       # display-only, PascalCase, named exports
│       ├── hooks/            # all business logic and data fetching lives here
│       └── types/
├── Dockerfile                # multi-stage Node 20 slim
├── fly.toml                  # Fly.io config
├── vercel.json               # rewrite rules + build config
└── CLAUDE.md                 # living project spec
```

**Separation of concerns:** custom hooks own all state and data fetching; components are purely display. This boundary is a hard rule — enforced in code review and in the agent workflow.

---

## Multi-Agent Development Workflow

This project was built using a structured **multi-agent Claude Code workflow** with three specialist agents invoked in a fixed order for every feature:

| Order | Agent | Responsibility |
|---|---|---|
| 1 | `project-manager` | Feature spec, acceptance criteria, user stories |
| 2 | `ux-designer` | Component map, layout, color and typography decisions |
| 3 | `frontend-dev` | React components, hooks, and Tailwind styling |

This mirrors a real product team workflow. Each agent produces a reviewable artifact before any code is written. Decisions are logged in [`CLAUDE.md`](./CLAUDE.md) and not re-litigated without explicit instruction — the file serves as the living project spec and is checked into the repo.

The workflow enforces discipline that's easy to skip in solo projects: no jumping to implementation before design is settled, no design before requirements are clear.

---

## Deployment

### Frontend — Vercel

- Auto-deploys from `main` via GitHub integration
- `vercel.json` handles the build command, output directory, SPA fallback, and `/api/*` proxy rewrite to the Fly.io backend
- No environment variables required on Vercel

### Backend — Fly.io

- Node.js containerized with a multi-stage Dockerfile (Node 20 slim, 69 MB image)
- SQLite database on a persistent Fly volume mounted at `/data/tabletop.db`
- Auto-seeds the four default teams on first boot — no manual migration step
- Health check at `/api/health` polled every 30 seconds
- `auto_stop_machines = true` keeps it within the free tier when idle

> SQLite on a persistent volume is the right call for a portfolio project at this scale. A production system with concurrent writes would use PostgreSQL.

---

## Getting Started Locally

**Prerequisites:** Node.js 20+

```bash
# 1. Clone
git clone https://github.com/drewuh/tabletop-baseball.git
cd tabletop-baseball

# 2. Backend
cd backend
npm install

# Create .env
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development
DATABASE_URL=./db/tabletop.db
EOF

npm run dev   # → http://localhost:3001
              # DB auto-seeds on first start

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev   # → http://localhost:5173
```

Open `http://localhost:5173`. The backend Vite proxy is pre-configured — no CORS setup needed in dev.

---

## Development Phases

The project was delivered in five phases, each with a defined gate before the next phase began.

| Phase | Theme | Key Deliverables |
|---|---|---|
| 1 | Game Engine | Dice mechanics, game state machine, REST API, functional (unstyled) UI |
| 2 | Visual Polish | Animated 3D dice, player cards, stadium scoreboard, diamond view, team color theming |
| 3 | Persistent Stats | `player_stats` + `team_season_record` tables, leaderboards, game history, two-step team selection |
| 4 | Mobile + Editor + AI | 375px responsive layout, full CRUD editor, AI roster generation (mock architecture) |
| 5 | Deployment | Vercel, Fly.io, persistent volume, Docker, auto-seed, GitHub auto-deploy |

---

## Code Conventions

- **TypeScript strict mode** throughout — no `any`
- Interfaces over type aliases; named exports; no default exports except page components
- Tailwind utility classes only — no custom CSS files
- Business logic in custom hooks; components are display-only
- Seed data in `backend/src/seeds/` — never hardcoded inline
- Node files: `camelCase.ts` | Component files: `PascalCase.tsx`

---

## Author

**Andrew Moyer**

Built as a portfolio project to demonstrate full-stack engineering across a realistic multi-phase product lifecycle — from game engine design through production deployment.

- GitHub: [@drewuh](https://github.com/drewuh)
