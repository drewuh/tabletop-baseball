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

export type StatsTab = 'batting' | 'pitching';

export type SortDirection = 'asc' | 'desc';

export type BattingSortKey =
  | 'playerName' | 'teamName' | 'gamesPlayed' | 'atBats'
  | 'hits' | 'homeRuns' | 'rbi' | 'walks' | 'strikeouts' | 'battingAverage';

export type PitchingSortKey =
  | 'playerName' | 'teamName' | 'gamesPlayed'
  | 'outsRecorded' | 'runsAllowed' | 'strikeoutsPitched';
