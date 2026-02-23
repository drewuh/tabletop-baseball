import db from '../db/client';

export interface BattingStatRow {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamAbbreviation: string;
  primaryColor: string;
  gamesPlayed: number;
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  battingAverage: number | null;
}

export interface PitchingStatRow {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  teamAbbreviation: string;
  primaryColor: string;
  gamesPlayed: number;
  outsRecorded: number;
  runsAllowed: number;
  strikeoutsPitched: number;
}

function ensurePlayerStats(playerId: string): void {
  db.prepare(
    'INSERT OR IGNORE INTO player_stats (player_id) VALUES (?)'
  ).run(playerId);
}

export function recordBatterAtBat(playerId: string, params: {
  isHit: boolean;
  resultType: string;
  runsScored: number;
  isWalk: boolean;
  isStrikeout: boolean;
}): void {
  ensurePlayerStats(playerId);
  db.prepare(`
    UPDATE player_stats SET
      at_bats        = at_bats        + @atBats,
      hits           = hits           + @hits,
      doubles        = doubles        + @doubles,
      triples        = triples        + @triples,
      home_runs      = home_runs      + @homeRuns,
      rbi            = rbi            + @rbi,
      walks          = walks          + @walks,
      strikeouts     = strikeouts     + @strikeouts
    WHERE player_id = @playerId
  `).run({
    playerId,
    atBats:     params.isWalk ? 0 : 1,
    hits:       params.isHit ? 1 : 0,
    doubles:    params.resultType === 'DOUBLE' ? 1 : 0,
    triples:    params.resultType === 'TRIPLE' ? 1 : 0,
    homeRuns:   params.resultType === 'HOME_RUN' ? 1 : 0,
    rbi:        params.runsScored,
    walks:      params.isWalk ? 1 : 0,
    strikeouts: params.isStrikeout ? 1 : 0,
  });
}

export function recordPitcherAtBat(playerId: string, params: {
  outsRecorded: number;
  runsAllowed: number;
  isStrikeout: boolean;
}): void {
  ensurePlayerStats(playerId);
  db.prepare(`
    UPDATE player_stats SET
      outs_recorded      = outs_recorded      + @outsRecorded,
      runs_allowed       = runs_allowed       + @runsAllowed,
      strikeouts_pitched = strikeouts_pitched + @strikeouts
    WHERE player_id = @playerId
  `).run({
    playerId,
    outsRecorded: params.outsRecorded,
    runsAllowed:  params.runsAllowed,
    strikeouts:   params.isStrikeout ? 1 : 0,
  });
}

export function recordGamesPlayed(playerIds: string[]): void {
  const stmt = db.prepare(
    'UPDATE player_stats SET games_played = games_played + 1 WHERE player_id = ?'
  );
  for (const id of playerIds) {
    ensurePlayerStats(id);
    stmt.run(id);
  }
}

export function recordGameResult(winningTeamId: string, losingTeamId: string): void {
  db.prepare(`
    INSERT INTO team_season_record (team_id, wins, losses) VALUES (?, 1, 0)
    ON CONFLICT(team_id) DO UPDATE SET wins = wins + 1
  `).run(winningTeamId);
  db.prepare(`
    INSERT INTO team_season_record (team_id, wins, losses) VALUES (?, 0, 1)
    ON CONFLICT(team_id) DO UPDATE SET losses = losses + 1
  `).run(losingTeamId);
}

export function getAllTeamRecords(): Record<string, { wins: number; losses: number }> {
  const rows = db.prepare(
    'SELECT team_id, wins, losses FROM team_season_record'
  ).all() as Array<{ team_id: string; wins: number; losses: number }>;
  const map: Record<string, { wins: number; losses: number }> = {};
  for (const row of rows) {
    map[row.team_id] = { wins: row.wins, losses: row.losses };
  }
  return map;
}

export function getBattingLeaders(): BattingStatRow[] {
  const rows = db.prepare(`
    SELECT
      p.id            AS playerId,
      p.name          AS playerName,
      t.id            AS teamId,
      t.name          AS teamName,
      t.abbreviation  AS teamAbbreviation,
      t.primary_color AS primaryColor,
      COALESCE(ps.games_played, 0) AS gamesPlayed,
      COALESCE(ps.at_bats,      0) AS atBats,
      COALESCE(ps.hits,         0) AS hits,
      COALESCE(ps.doubles,      0) AS doubles,
      COALESCE(ps.triples,      0) AS triples,
      COALESCE(ps.home_runs,    0) AS homeRuns,
      COALESCE(ps.rbi,          0) AS rbi,
      COALESCE(ps.walks,        0) AS walks,
      COALESCE(ps.strikeouts,   0) AS strikeouts
    FROM players p
    JOIN  teams t  ON t.id = p.team_id
    LEFT JOIN player_stats ps ON ps.player_id = p.id
    WHERE p.is_pitcher = 0
    ORDER BY hits DESC, atBats DESC, playerName ASC
  `).all() as Array<{
    playerId: string; playerName: string; teamId: string; teamName: string;
    teamAbbreviation: string; primaryColor: string;
    gamesPlayed: number; atBats: number; hits: number; doubles: number;
    triples: number; homeRuns: number; rbi: number; walks: number; strikeouts: number;
  }>;

  return rows.map(row => ({
    ...row,
    battingAverage: row.atBats > 0 ? row.hits / row.atBats : null,
  }));
}

export function getPitchingLeaders(): PitchingStatRow[] {
  return db.prepare(`
    SELECT
      p.id            AS playerId,
      p.name          AS playerName,
      t.id            AS teamId,
      t.name          AS teamName,
      t.abbreviation  AS teamAbbreviation,
      t.primary_color AS primaryColor,
      COALESCE(ps.games_played,        0) AS gamesPlayed,
      COALESCE(ps.outs_recorded,       0) AS outsRecorded,
      COALESCE(ps.runs_allowed,        0) AS runsAllowed,
      COALESCE(ps.strikeouts_pitched,  0) AS strikeoutsPitched
    FROM players p
    JOIN  teams t  ON t.id = p.team_id
    LEFT JOIN player_stats ps ON ps.player_id = p.id
    WHERE p.is_pitcher = 1
    ORDER BY runsAllowed ASC, outsRecorded DESC, playerName ASC
  `).all() as PitchingStatRow[];
}
