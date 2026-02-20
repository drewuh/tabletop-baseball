import { Player } from './player';
import { Team } from './team';

export interface TeamInfo extends Team {
  currentPitcher: Player;
}

export interface RollResult {
  d20: number;
  d6a: number;
  d6b: number;
  d6Sum: number;
  usedBatterCard: boolean;
}

export type PlayResultType =
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'HOME_RUN'
  | 'WALK'
  | 'STRIKEOUT'
  | 'GROUND_OUT'
  | 'FLY_OUT'
  | 'LINE_OUT';

export interface PlayResult {
  type: PlayResultType;
  description: string;
  rbi: number;
}

export interface BaseRunners {
  first: boolean;
  second: boolean;
  third: boolean;
}

export interface InningScore {
  id: number;
  game_id: string;
  inning: number;
  is_top: number;
  runs: number;
  hits: number;
  errors: number;
}

export interface ScoreTotals {
  runs: number;
  hits: number;
  errors: number;
}

export interface GameLogEntry {
  id: number;
  game_id: string;
  inning: number;
  is_top: number;
  entry_type: string;
  text: string;
}

export type GamePhase = 'active' | 'complete';

export interface GameState {
  id: string;
  phase: GamePhase;
  currentInning: number;
  isTopInning: boolean;
  outs: number;
  baseRunners: BaseRunners;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeLineup: Player[];
  awayLineup: Player[];
  homeBatterIndex: number;
  awayBatterIndex: number;
  innings: InningScore[];
  log: GameLogEntry[];
}

export interface AtBatResult {
  roll: RollResult;
  play: PlayResult;
  runsScored: number;
  outsRecorded: number;
  newOuts: number;
  newBaseRunners: BaseRunners;
  currentInning: number;
  isTopInning: boolean;
  phase: GamePhase;
}
