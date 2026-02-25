import db from '../db/client';

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

export interface RollResult {
  d20: number;
  d6a: number;
  d6b: number;
  usedBatterCard: boolean;
}

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

export interface AtBatContext {
  batterId: string;
  pitcherId: string;
  baseRunners: BaseRunners;
  outs: number;
}

export interface AtBatOutcome {
  roll: RollResult;
  play: PlayResult;
  newBaseRunners: BaseRunners;
  runsScored: number;
  outsRecorded: number;
  isHit: boolean;
}

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function lookupResult(playerId: string, col: number, row: number, isBatterCard: boolean): PlayResultType {
  const table = isBatterCard ? 'batter_cards' : 'pitcher_cards';
  const result = db.prepare(
    `SELECT result FROM ${table} WHERE player_id = ? AND col = ? AND row = ?`
  ).get(playerId, col, row) as { result: PlayResultType } | undefined;

  if (!result) return 'GROUND_OUT';
  return result.result;
}

function buildDescription(
  batterName: string,
  pitcherName: string,
  result: PlayResultType
): string {
  const descriptions: Record<PlayResultType, string[]> = {
    SINGLE: [
      `${batterName} singles through the left side.`,
      `${batterName} lines one into right field.`,
      `${batterName} drops a single into shallow center.`,
    ],
    DOUBLE: [
      `${batterName} doubles off the wall in left-center.`,
      `${batterName} rips a gapper to right-center.`,
    ],
    TRIPLE: [
      `${batterName} legs out a triple to the right field corner!`,
      `${batterName} smokes one into the gap, all the way to the wall!`,
    ],
    HOME_RUN: [
      `${batterName} goes deep! That ball is GONE!`,
      `${batterName} crushes one to deep left — home run!`,
      `${batterName} gets all of that one. It's out of here!`,
    ],
    WALK: [
      `${pitcherName} walks ${batterName} on four pitches.`,
      `${batterName} works a walk.`,
    ],
    STRIKEOUT: [
      `${pitcherName} blows a fastball past ${batterName}. Struck out!`,
      `${batterName} swings and misses. Strikeout.`,
      `${pitcherName} rings up ${batterName} looking.`,
    ],
    GROUND_OUT: [
      `${batterName} grounds out to second.`,
      `${batterName} chops one to third — thrown out at first.`,
      `${batterName} rolls over, grounds to short.`,
    ],
    FLY_OUT: [
      `${batterName} flies out to center.`,
      `${batterName} lifts a lazy fly ball to right.`,
      `${batterName} pops up to the second baseman.`,
    ],
    LINE_OUT: [
      `${batterName} stings one, but right at the shortstop. Line out.`,
      `${batterName} smokes a liner — caught!`,
    ],
  };

  const options = descriptions[result];
  return options[Math.floor(Math.random() * options.length)];
}

function advanceRunners(
  result: PlayResultType,
  runners: BaseRunners
): { newRunners: BaseRunners; runs: number } {
  let { first, second, third } = runners;
  let runs = 0;

  switch (result) {
    case 'SINGLE': {
      if (third) { runs++; third = false; }
      if (second) { third = true; second = false; }
      if (first) { second = true; }
      first = true;
      break;
    }
    case 'DOUBLE': {
      if (third) { runs++; third = false; }
      if (second) { runs++; second = false; }
      if (first) { third = true; first = false; }
      second = true;
      break;
    }
    case 'TRIPLE': {
      if (third) { runs++; third = false; }
      if (second) { runs++; second = false; }
      if (first) { runs++; first = false; }
      third = true;
      break;
    }
    case 'HOME_RUN': {
      if (third) { runs++; third = false; }
      if (second) { runs++; second = false; }
      if (first) { runs++; first = false; }
      runs++; // batter scores
      break;
    }
    case 'WALK': {
      // Force advance only if base occupied
      if (first && second && third) { runs++; }
      else if (first && second) { third = true; }
      else if (first) { second = true; }
      first = true;
      break;
    }
    default:
      break;
  }

  return { newRunners: { first, second, third }, runs };
}

function recordOuts(
  result: PlayResultType,
  runners: BaseRunners,
  currentOuts: number
): { newRunners: BaseRunners; outsRecorded: number } {
  const isOut = ['STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'LINE_OUT'].includes(result);
  if (!isOut) return { newRunners: runners, outsRecorded: 0 };

  // Sacrifice fly: runner on third, less than 2 outs
  if (result === 'FLY_OUT' && runners.third && currentOuts < 2) {
    return {
      newRunners: { ...runners, third: false },
      outsRecorded: 1,
    };
  }

  return { newRunners: runners, outsRecorded: 1 };
}

export function resolveAtBat(
  context: AtBatContext,
  batterName: string,
  pitcherName: string
): AtBatOutcome {
  const d20 = rollD20();
  const d6a = rollD6(); // col
  const d6b = rollD6(); // row
  const usedBatterCard = d20 <= 10;
  const playerId = usedBatterCard ? context.batterId : context.pitcherId;
  const resultType = lookupResult(playerId, d6a, d6b, usedBatterCard);
  const roll: RollResult = { d20, d6a, d6b, usedBatterCard };

  const isHit = ['SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN'].includes(resultType);

  let newRunners = { ...context.baseRunners };
  let runsScored = 0;
  let outsRecorded = 0;

  if (isHit || resultType === 'WALK') {
    const advanced = advanceRunners(resultType, newRunners);
    newRunners = advanced.newRunners;
    runsScored = advanced.runs;
  } else {
    const recorded = recordOuts(resultType, newRunners, context.outs);
    newRunners = recorded.newRunners;
    outsRecorded = recorded.outsRecorded;
    // Sac fly run
    if (resultType === 'FLY_OUT' && context.baseRunners.third && context.outs < 2) {
      runsScored = 1;
    }
  }

  const description = buildDescription(batterName, pitcherName, resultType);

  return {
    roll,
    play: { type: resultType, description, rbi: runsScored },
    newBaseRunners: newRunners,
    runsScored,
    outsRecorded,
    isHit,
  };
}
