import db from '../db/client';

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
