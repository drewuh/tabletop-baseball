import db from './client';

export function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      name TEXT NOT NULL,
      abbreviation TEXT NOT NULL,
      primary_color TEXT NOT NULL,
      secondary_color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL REFERENCES teams(id),
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      batting_order INTEGER,
      is_pitcher INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS batter_cards (
      player_id TEXT NOT NULL REFERENCES players(id),
      col INTEGER NOT NULL,
      row INTEGER NOT NULL,
      result TEXT NOT NULL,
      PRIMARY KEY (player_id, col, row)
    );

    CREATE TABLE IF NOT EXISTS pitcher_cards (
      player_id TEXT NOT NULL REFERENCES players(id),
      col INTEGER NOT NULL,
      row INTEGER NOT NULL,
      result TEXT NOT NULL,
      PRIMARY KEY (player_id, col, row)
    );

    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      home_team_id TEXT NOT NULL REFERENCES teams(id),
      away_team_id TEXT NOT NULL REFERENCES teams(id),
      player_team_id TEXT NOT NULL REFERENCES teams(id),
      current_inning INTEGER NOT NULL DEFAULT 1,
      is_top_inning INTEGER NOT NULL DEFAULT 1,
      outs INTEGER NOT NULL DEFAULT 0,
      runner_on_first INTEGER NOT NULL DEFAULT 0,
      runner_on_second INTEGER NOT NULL DEFAULT 0,
      runner_on_third INTEGER NOT NULL DEFAULT 0,
      home_pitcher_id TEXT NOT NULL REFERENCES players(id),
      away_pitcher_id TEXT NOT NULL REFERENCES players(id),
      home_batter_index INTEGER NOT NULL DEFAULT 0,
      away_batter_index INTEGER NOT NULL DEFAULT 0,
      phase TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inning_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL REFERENCES games(id),
      inning INTEGER NOT NULL,
      is_top INTEGER NOT NULL,
      runs INTEGER NOT NULL DEFAULT 0,
      hits INTEGER NOT NULL DEFAULT 0,
      errors INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS game_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL REFERENCES games(id),
      inning INTEGER NOT NULL,
      is_top INTEGER NOT NULL,
      entry_type TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS player_stats (
      player_id TEXT PRIMARY KEY REFERENCES players(id),
      games_played INTEGER NOT NULL DEFAULT 0,
      at_bats INTEGER NOT NULL DEFAULT 0,
      hits INTEGER NOT NULL DEFAULT 0,
      doubles INTEGER NOT NULL DEFAULT 0,
      triples INTEGER NOT NULL DEFAULT 0,
      home_runs INTEGER NOT NULL DEFAULT 0,
      rbi INTEGER NOT NULL DEFAULT 0,
      walks INTEGER NOT NULL DEFAULT 0,
      strikeouts INTEGER NOT NULL DEFAULT 0,
      outs_recorded INTEGER NOT NULL DEFAULT 0,
      runs_allowed INTEGER NOT NULL DEFAULT 0,
      strikeouts_pitched INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS team_season_record (
      team_id TEXT PRIMARY KEY REFERENCES teams(id),
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS api_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      model TEXT NOT NULL,
      prompt_tokens INTEGER NOT NULL,
      completion_tokens INTEGER NOT NULL,
      is_mock INTEGER NOT NULL DEFAULT 1
    );
  `);
}
