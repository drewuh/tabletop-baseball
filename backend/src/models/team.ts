import db from '../db/client';

// ── CRUD types ────────────────────────────────────────────────────────────────

export interface TeamCreateInput {
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
}

export interface PlayerCreateInput {
  id: string;
  team_id: string;
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  card: CardRow[];
}

export interface Team {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
}

export interface Player {
  id: string;
  team_id: string;
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
}

export function getAllTeams(): Team[] {
  return db.prepare('SELECT * FROM teams ORDER BY name').all() as Team[];
}

export function getTeamById(id: string): Team | undefined {
  return db.prepare('SELECT * FROM teams WHERE id = ?').get(id) as Team | undefined;
}

export function getRoster(teamId: string): Player[] {
  return db.prepare(
    `SELECT * FROM players WHERE team_id = ? ORDER BY batting_order ASC NULLS LAST, name ASC`
  ).all(teamId) as Player[];
}

export function getLineup(teamId: string): Player[] {
  return db.prepare(
    `SELECT * FROM players WHERE team_id = ? AND is_pitcher = 0 ORDER BY batting_order ASC`
  ).all(teamId) as Player[];
}

export function getStartingPitcher(teamId: string): Player | undefined {
  return db.prepare(
    `SELECT * FROM players WHERE team_id = ? AND is_pitcher = 1 AND position = 'SP' LIMIT 1`
  ).get(teamId) as Player | undefined;
}

export function getPlayerById(id: string): Player | undefined {
  return db.prepare('SELECT * FROM players WHERE id = ?').get(id) as Player | undefined;
}

export interface CardRow {
  col: number;
  row: number;
  result: string;
}

export interface PlayerCard {
  playerId: string;
  playerName: string;
  position: string;
  teamAbbreviation: string;
  isPitcher: boolean;
  rows: CardRow[];
}

// ── Team CRUD ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function createTeam(input: TeamCreateInput): Team {
  const slug = slugify(`${input.city} ${input.name}`);
  const id = `team-${slug}`;
  db.prepare(
    `INSERT INTO teams (id, city, name, abbreviation, primary_color, secondary_color)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, input.city, input.name, input.abbreviation.toUpperCase(), input.primary_color, input.secondary_color);
  db.prepare(
    `INSERT OR IGNORE INTO team_season_record (team_id) VALUES (?)`
  ).run(id);
  return getTeamById(id)!;
}

export function updateTeam(id: string, input: Partial<TeamCreateInput>): Team | undefined {
  const team = getTeamById(id);
  if (!team) return undefined;
  const updated = {
    city: input.city ?? team.city,
    name: input.name ?? team.name,
    abbreviation: input.abbreviation ? input.abbreviation.toUpperCase() : team.abbreviation,
    primary_color: input.primary_color ?? team.primary_color,
    secondary_color: input.secondary_color ?? team.secondary_color,
  };
  db.prepare(
    `UPDATE teams SET city=?, name=?, abbreviation=?, primary_color=?, secondary_color=? WHERE id=?`
  ).run(updated.city, updated.name, updated.abbreviation, updated.primary_color, updated.secondary_color, id);
  return getTeamById(id);
}

export function teamHasGames(id: string): boolean {
  const row = db.prepare(
    `SELECT 1 FROM games WHERE home_team_id = ? OR away_team_id = ? LIMIT 1`
  ).get(id, id);
  return row !== undefined;
}

export function deleteTeam(id: string): void {
  const playerIds = (db.prepare('SELECT id FROM players WHERE team_id = ?').all(id) as { id: string }[]).map(r => r.id);
  db.transaction(() => {
    for (const pid of playerIds) {
      db.prepare('DELETE FROM batter_cards WHERE player_id = ?').run(pid);
      db.prepare('DELETE FROM pitcher_cards WHERE player_id = ?').run(pid);
      db.prepare('DELETE FROM player_stats WHERE player_id = ?').run(pid);
    }
    db.prepare('DELETE FROM players WHERE team_id = ?').run(id);
    db.prepare('DELETE FROM team_season_record WHERE team_id = ?').run(id);
    db.prepare('DELETE FROM teams WHERE id = ?').run(id);
  })();
}

// ── Player CRUD ───────────────────────────────────────────────────────────────

export function createPlayer(input: PlayerCreateInput): Player {
  db.transaction(() => {
    db.prepare(
      `INSERT INTO players (id, team_id, name, position, batting_order, is_pitcher)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(input.id, input.team_id, input.name, input.position, input.batting_order, input.is_pitcher ? 1 : 0);
    const table = input.is_pitcher ? 'pitcher_cards' : 'batter_cards';
    const insertCell = db.prepare(`INSERT INTO ${table} (player_id, col, row, result) VALUES (?, ?, ?, ?)`);
    for (const cell of input.card) {
      insertCell.run(input.id, cell.col, cell.row, cell.result);
    }
  })();
  return getPlayerById(input.id)!;
}

export function updatePlayer(id: string, input: Partial<Omit<PlayerCreateInput, 'id' | 'team_id'>>): Player | undefined {
  const player = getPlayerById(id);
  if (!player) return undefined;
  db.transaction(() => {
    if (input.name !== undefined || input.position !== undefined || input.batting_order !== undefined) {
      const name = input.name ?? player.name;
      const position = input.position ?? player.position;
      const batting_order = input.batting_order !== undefined ? input.batting_order : player.batting_order;
      db.prepare(
        `UPDATE players SET name=?, position=?, batting_order=? WHERE id=?`
      ).run(name, position, batting_order, id);
    }
    if (input.card !== undefined) {
      const table = player.is_pitcher ? 'pitcher_cards' : 'batter_cards';
      db.prepare(`DELETE FROM ${table} WHERE player_id = ?`).run(id);
      const insertCell = db.prepare(`INSERT INTO ${table} (player_id, col, row, result) VALUES (?, ?, ?, ?)`);
      for (const cell of input.card) {
        insertCell.run(id, cell.col, cell.row, cell.result);
      }
    }
  })();
  return getPlayerById(id);
}

export function deletePlayer(id: string): void {
  const player = getPlayerById(id);
  if (!player) return;
  db.transaction(() => {
    db.prepare('DELETE FROM batter_cards WHERE player_id = ?').run(id);
    db.prepare('DELETE FROM pitcher_cards WHERE player_id = ?').run(id);
    db.prepare('DELETE FROM player_stats WHERE player_id = ?').run(id);
    db.prepare('DELETE FROM players WHERE id = ?').run(id);
  })();
}

export function bulkCreatePlayers(teamId: string, players: PlayerCreateInput[]): void {
  const existingIds = (db.prepare('SELECT id FROM players WHERE team_id = ?').all(teamId) as { id: string }[]).map(r => r.id);
  db.transaction(() => {
    for (const pid of existingIds) {
      db.prepare('DELETE FROM batter_cards WHERE player_id = ?').run(pid);
      db.prepare('DELETE FROM pitcher_cards WHERE player_id = ?').run(pid);
      db.prepare('DELETE FROM player_stats WHERE player_id = ?').run(pid);
    }
    db.prepare('DELETE FROM players WHERE team_id = ?').run(teamId);
    for (const p of players) {
      db.prepare(
        `INSERT INTO players (id, team_id, name, position, batting_order, is_pitcher)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).run(p.id, teamId, p.name, p.position, p.batting_order, p.is_pitcher ? 1 : 0);
      const table = p.is_pitcher ? 'pitcher_cards' : 'batter_cards';
      const insertCell = db.prepare(`INSERT INTO ${table} (player_id, col, row, result) VALUES (?, ?, ?, ?)`);
      for (const cell of p.card) {
        insertCell.run(p.id, cell.col, cell.row, cell.result);
      }
    }
  })();
}

export function getPlayerCard(playerId: string): PlayerCard | undefined {
  const player = db.prepare(
    `SELECT p.id, p.name, p.position, p.is_pitcher, t.abbreviation
     FROM players p
     JOIN teams t ON t.id = p.team_id
     WHERE p.id = ?`
  ).get(playerId) as { id: string; name: string; position: string; is_pitcher: number; abbreviation: string } | undefined;

  if (!player) return undefined;

  const table = player.is_pitcher ? 'pitcher_cards' : 'batter_cards';
  const rows = db.prepare(
    `SELECT col, row, result FROM ${table} WHERE player_id = ? ORDER BY col ASC, row ASC`
  ).all(playerId) as CardRow[];

  return {
    playerId: player.id,
    playerName: player.name,
    position: player.position,
    teamAbbreviation: player.abbreviation,
    isPitcher: player.is_pitcher === 1,
    rows,
  };
}
