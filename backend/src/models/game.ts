import db from '../db/client';
import { BaseRunners } from '../services/gameEngine';

export interface GameRow {
  id: string;
  home_team_id: string;
  away_team_id: string;
  player_team_id: string;
  current_inning: number;
  is_top_inning: number;
  outs: number;
  runner_on_first: number;
  runner_on_second: number;
  runner_on_third: number;
  home_pitcher_id: string;
  away_pitcher_id: string;
  home_batter_index: number;
  away_batter_index: number;
  phase: string;
}

export interface InningScoreRow {
  id: number;
  game_id: string;
  inning: number;
  is_top: number;
  runs: number;
  hits: number;
  errors: number;
}

export interface GameLogRow {
  id: number;
  game_id: string;
  inning: number;
  is_top: number;
  entry_type: string;
  text: string;
}

export function createGame(params: {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  playerTeamId: string;
  homePitcherId: string;
  awayPitcherId: string;
}): void {
  db.prepare(`
    INSERT INTO games (id, home_team_id, away_team_id, player_team_id, home_pitcher_id, away_pitcher_id)
    VALUES (@id, @homeTeamId, @awayTeamId, @playerTeamId, @homePitcherId, @awayPitcherId)
  `).run(params);
}

export function getGameById(id: string): GameRow | undefined {
  return db.prepare('SELECT * FROM games WHERE id = ?').get(id) as GameRow | undefined;
}

export function updateGameState(gameId: string, updates: {
  currentInning?: number;
  isTopInning?: boolean;
  outs?: number;
  runners?: BaseRunners;
  homeBatterIndex?: number;
  awayBatterIndex?: number;
  phase?: string;
}): void {
  const fields: string[] = [];
  const values: Record<string, unknown> = { id: gameId };

  if (updates.currentInning !== undefined) {
    fields.push('current_inning = @currentInning');
    values.currentInning = updates.currentInning;
  }
  if (updates.isTopInning !== undefined) {
    fields.push('is_top_inning = @isTopInning');
    values.isTopInning = updates.isTopInning ? 1 : 0;
  }
  if (updates.outs !== undefined) {
    fields.push('outs = @outs');
    values.outs = updates.outs;
  }
  if (updates.runners !== undefined) {
    fields.push('runner_on_first = @first, runner_on_second = @second, runner_on_third = @third');
    values.first = updates.runners.first ? 1 : 0;
    values.second = updates.runners.second ? 1 : 0;
    values.third = updates.runners.third ? 1 : 0;
  }
  if (updates.homeBatterIndex !== undefined) {
    fields.push('home_batter_index = @homeBatterIndex');
    values.homeBatterIndex = updates.homeBatterIndex;
  }
  if (updates.awayBatterIndex !== undefined) {
    fields.push('away_batter_index = @awayBatterIndex');
    values.awayBatterIndex = updates.awayBatterIndex;
  }
  if (updates.phase !== undefined) {
    fields.push('phase = @phase');
    values.phase = updates.phase;
  }

  if (fields.length === 0) return;

  db.prepare(`UPDATE games SET ${fields.join(', ')} WHERE id = @id`).run(values);
}

export function upsertInningScore(gameId: string, inning: number, isTop: boolean, runs: number, hits: number): void {
  const existing = db.prepare(
    'SELECT id FROM inning_scores WHERE game_id = ? AND inning = ? AND is_top = ?'
  ).get(gameId, inning, isTop ? 1 : 0) as { id: number } | undefined;

  if (existing) {
    db.prepare(
      'UPDATE inning_scores SET runs = runs + @runs, hits = hits + @hits WHERE id = @id'
    ).run({ runs, hits, id: existing.id });
  } else {
    db.prepare(
      'INSERT INTO inning_scores (game_id, inning, is_top, runs, hits) VALUES (?, ?, ?, ?, ?)'
    ).run(gameId, inning, isTop ? 1 : 0, runs, hits);
  }
}

export function getInningScores(gameId: string): InningScoreRow[] {
  return db.prepare(
    'SELECT * FROM inning_scores WHERE game_id = ? ORDER BY inning ASC, is_top DESC'
  ).all(gameId) as InningScoreRow[];
}

export function addLogEntry(gameId: string, inning: number, isTop: boolean, type: string, text: string): void {
  db.prepare(
    'INSERT INTO game_log (game_id, inning, is_top, entry_type, text) VALUES (?, ?, ?, ?, ?)'
  ).run(gameId, inning, isTop ? 1 : 0, type, text);
}

export function getGameLog(gameId: string): GameLogRow[] {
  return db.prepare(
    'SELECT * FROM game_log WHERE game_id = ? ORDER BY id ASC'
  ).all(gameId) as GameLogRow[];
}
