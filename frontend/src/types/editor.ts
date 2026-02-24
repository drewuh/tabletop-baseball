export interface CardCellData {
  col: number;
  row: number;
  result: string;
}

/** Flat 36-cell array matching the DB card structure */
export type CardGrid = CardCellData[];

export interface TeamEditorData {
  id: string;
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
  wins?: number;
  losses?: number;
}

export interface PlayerEditorData {
  id: string;
  team_id: string;
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  card: CardGrid;
}

export interface GeneratedPlayer {
  id: string;
  team_id: string;
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  archetype: string;
  card: CardGrid;
}

export interface RosterGenerationResult {
  players: GeneratedPlayer[];
  isSimulated: boolean;
}

export type PlayerPosition = 'C' | '1B' | '2B' | '3B' | 'SS' | 'LF' | 'CF' | 'RF' | 'DH' | 'SP';

export const BATTER_POSITIONS: PlayerPosition[] = ['C','1B','2B','3B','SS','LF','CF','RF','DH'];
export const PITCHER_POSITIONS: PlayerPosition[] = ['SP'];
export const ALL_POSITIONS: PlayerPosition[] = [...BATTER_POSITIONS, ...PITCHER_POSITIONS];

export const RESULT_OPTIONS: string[] = [
  'SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN',
  'WALK', 'STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'LINE_OUT',
];

export const RESULT_LABELS: Record<string, string> = {
  SINGLE: '1B', DOUBLE: '2B', TRIPLE: '3B', HOME_RUN: 'HR',
  WALK: 'BB', STRIKEOUT: 'K', GROUND_OUT: 'GO', FLY_OUT: 'FO', LINE_OUT: 'LO',
};

/** Build an empty 36-cell grid defaulting each cell to 'GROUND_OUT' */
export function emptyCardGrid(): CardGrid {
  const cells: CardGrid = [];
  for (let col = 1; col <= 6; col++) {
    for (let row = 1; row <= 6; row++) {
      cells.push({ col, row, result: 'GROUND_OUT' });
    }
  }
  return cells;
}

export function getCell(grid: CardGrid, col: number, row: number): CardCellData | undefined {
  return grid.find(c => c.col === col && c.row === row);
}

export function setCell(grid: CardGrid, col: number, row: number, result: string): CardGrid {
  return grid.map(c => c.col === col && c.row === row ? { ...c, result } : c);
}

/** Roster completeness check */
export interface RosterStatus {
  battersFilled: number;
  battersNeeded: number;
  pitchersFilled: number;
  pitchersNeeded: number;
  isComplete: boolean;
}

export function getRosterStatus(players: Pick<PlayerEditorData, 'is_pitcher' | 'position'>[]): RosterStatus {
  const batters = players.filter(p => !p.is_pitcher);
  const pitchers = players.filter(p => p.is_pitcher && p.position === 'SP');
  const battersFilled = batters.length;
  const pitchersFilled = pitchers.length;
  return {
    battersFilled,
    battersNeeded: 9,
    pitchersFilled,
    pitchersNeeded: 1,
    isComplete: battersFilled >= 9 && pitchersFilled >= 1,
  };
}
