import { PlayResultType } from '../services/gameEngine';

export interface CardRow {
  col: number;
  row: number;
  result: PlayResultType;
}

export type BatterProfile = 'power' | 'contact' | 'balanced' | 'speedster';
export type PitcherProfile = 'ace' | 'groundball' | 'strikeout' | 'average';

export function buildBatterCard(profile: BatterProfile): CardRow[] {
  const tables: Record<BatterProfile, PlayResultType[]> = {
    // 36 values in col-major order: (col-1)*6 + (row-1)
    // power: feast-or-famine — heavy HR (4), heavy K (7), some 2B (4), some 1B (6), GO/FO, 1 BB
    power: [
      // col 1
      'HOME_RUN', 'HOME_RUN', 'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'DOUBLE',
      // col 2
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'DOUBLE', 'FLY_OUT', 'SINGLE',
      // col 3
      'HOME_RUN', 'STRIKEOUT', 'GROUND_OUT', 'DOUBLE', 'FLY_OUT', 'SINGLE',
      // col 4
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'DOUBLE', 'FLY_OUT', 'SINGLE',
      // col 5
      'HOME_RUN', 'STRIKEOUT', 'FLY_OUT', 'SINGLE', 'SINGLE', 'SINGLE',
      // col 6
      'WALK', 'STRIKEOUT', 'GROUND_OUT', 'SINGLE', 'SINGLE', 'FLY_OUT',
    ],
    // contact: heavy 1B (11), some 2B (4), 1 3B, 0 HR, few K (3), some GO/FO, 2 BB
    contact: [
      // col 1
      'SINGLE', 'SINGLE', 'SINGLE', 'GROUND_OUT', 'DOUBLE', 'SINGLE',
      // col 2
      'SINGLE', 'SINGLE', 'GROUND_OUT', 'DOUBLE', 'WALK', 'SINGLE',
      // col 3
      'SINGLE', 'SINGLE', 'GROUND_OUT', 'DOUBLE', 'FLY_OUT', 'STRIKEOUT',
      // col 4
      'SINGLE', 'SINGLE', 'GROUND_OUT', 'DOUBLE', 'FLY_OUT', 'STRIKEOUT',
      // col 5
      'SINGLE', 'SINGLE', 'GROUND_OUT', 'FLY_OUT', 'WALK', 'STRIKEOUT',
      // col 6
      'SINGLE', 'TRIPLE', 'GROUND_OUT', 'FLY_OUT', 'GROUND_OUT', 'SINGLE',
    ],
    // balanced: 1 HR, 2 2B, 7 1B, 1 3B, 5 K, 5 GO, 4 FO, 1 LO, 2 BB
    balanced: [
      // col 1
      'HOME_RUN', 'STRIKEOUT', 'GROUND_OUT', 'SINGLE', 'GROUND_OUT', 'FLY_OUT',
      // col 2
      'DOUBLE', 'STRIKEOUT', 'GROUND_OUT', 'SINGLE', 'GROUND_OUT', 'FLY_OUT',
      // col 3
      'DOUBLE', 'STRIKEOUT', 'GROUND_OUT', 'SINGLE', 'FLY_OUT', 'WALK',
      // col 4
      'SINGLE', 'STRIKEOUT', 'GROUND_OUT', 'SINGLE', 'FLY_OUT', 'WALK',
      // col 5
      'SINGLE', 'STRIKEOUT', 'LINE_OUT', 'SINGLE', 'FLY_OUT', 'SINGLE',
      // col 6
      'TRIPLE', 'SINGLE', 'SINGLE', 'SINGLE', 'GROUND_OUT', 'FLY_OUT',
    ],
    // speedster: 2 3B, 9 1B, 1 2B, 1 HR, 4 GO, 3 FO, 4 K, 2 BB
    speedster: [
      // col 1
      'TRIPLE', 'SINGLE', 'GROUND_OUT', 'SINGLE', 'GROUND_OUT', 'FLY_OUT',
      // col 2
      'SINGLE', 'SINGLE', 'GROUND_OUT', 'SINGLE', 'FLY_OUT', 'STRIKEOUT',
      // col 3
      'SINGLE', 'SINGLE', 'WALK', 'SINGLE', 'FLY_OUT', 'STRIKEOUT',
      // col 4
      'TRIPLE', 'SINGLE', 'GROUND_OUT', 'SINGLE', 'FLY_OUT', 'STRIKEOUT',
      // col 5
      'SINGLE', 'WALK', 'GROUND_OUT', 'SINGLE', 'DOUBLE', 'STRIKEOUT',
      // col 6
      'HOME_RUN', 'SINGLE', 'SINGLE', 'SINGLE', 'SINGLE', 'SINGLE',
    ],
  };

  const results = tables[profile];
  const rows: CardRow[] = [];
  for (let col = 1; col <= 6; col++) {
    for (let row = 1; row <= 6; row++) {
      rows.push({ col, row, result: results[(col - 1) * 6 + (row - 1)] });
    }
  }
  return rows;
}

export function buildPitcherCard(profile: PitcherProfile): CardRow[] {
  const tables: Record<PitcherProfile, PlayResultType[]> = {
    // 36 values in col-major order: (col-1)*6 + (row-1)
    // ace: 7 K, 6 GO, 4 FO, 2 LO, 5 1B, 2 2B, 0 HR, 2 BB. Dominant.
    ace: [
      // col 1
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 2
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 3
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'LINE_OUT', 'FLY_OUT', 'SINGLE',
      // col 4
      'STRIKEOUT', 'GROUND_OUT', 'LINE_OUT', 'FLY_OUT', 'DOUBLE', 'SINGLE',
      // col 5
      'WALK', 'GROUND_OUT', 'SINGLE', 'FLY_OUT', 'DOUBLE', 'SINGLE',
      // col 6
      'WALK', 'STRIKEOUT', 'SINGLE', 'SINGLE', 'FLY_OUT', 'GROUND_OUT',
    ],
    // groundball: 10 GO, 4 K, 4 FO, 1 LO, 6 1B, 2 2B, 0 HR, 2 BB
    groundball: [
      // col 1
      'GROUND_OUT', 'GROUND_OUT', 'GROUND_OUT', 'STRIKEOUT', 'FLY_OUT', 'SINGLE',
      // col 2
      'GROUND_OUT', 'GROUND_OUT', 'GROUND_OUT', 'STRIKEOUT', 'FLY_OUT', 'SINGLE',
      // col 3
      'GROUND_OUT', 'GROUND_OUT', 'STRIKEOUT', 'LINE_OUT', 'FLY_OUT', 'SINGLE',
      // col 4
      'GROUND_OUT', 'GROUND_OUT', 'STRIKEOUT', 'FLY_OUT', 'DOUBLE', 'SINGLE',
      // col 5
      'WALK', 'GROUND_OUT', 'SINGLE', 'DOUBLE', 'SINGLE', 'SINGLE',
      // col 6
      'WALK', 'GROUND_OUT', 'SINGLE', 'SINGLE', 'FLY_OUT', 'GROUND_OUT',
    ],
    // strikeout: 10 K, 5 FO, 3 GO, 1 LO, 5 1B, 2 2B, 1 HR, 2 BB
    strikeout: [
      // col 1
      'STRIKEOUT', 'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 2
      'STRIKEOUT', 'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 3
      'STRIKEOUT', 'STRIKEOUT', 'STRIKEOUT', 'LINE_OUT', 'FLY_OUT', 'SINGLE',
      // col 4
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'DOUBLE', 'SINGLE',
      // col 5
      'WALK', 'STRIKEOUT', 'FLY_OUT', 'DOUBLE', 'SINGLE', 'SINGLE',
      // col 6
      'WALK', 'STRIKEOUT', 'FLY_OUT', 'SINGLE', 'SINGLE', 'HOME_RUN',
    ],
    // average: 5 GO, 5 K, 4 FO, 1 LO, 8 1B, 3 2B, 1 HR, 2 BB
    average: [
      // col 1
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 2
      'STRIKEOUT', 'STRIKEOUT', 'GROUND_OUT', 'GROUND_OUT', 'FLY_OUT', 'SINGLE',
      // col 3
      'STRIKEOUT', 'LINE_OUT', 'GROUND_OUT', 'FLY_OUT', 'DOUBLE', 'SINGLE',
      // col 4
      'STRIKEOUT', 'SINGLE', 'FLY_OUT', 'DOUBLE', 'SINGLE', 'SINGLE',
      // col 5
      'WALK', 'SINGLE', 'DOUBLE', 'SINGLE', 'SINGLE', 'HOME_RUN',
      // col 6
      'WALK', 'SINGLE', 'SINGLE', 'SINGLE', 'FLY_OUT', 'GROUND_OUT',
    ],
  };

  const results = tables[profile];
  const rows: CardRow[] = [];
  for (let col = 1; col <= 6; col++) {
    for (let row = 1; row <= 6; row++) {
      rows.push({ col, row, result: results[(col - 1) * 6 + (row - 1)] });
    }
  }
  return rows;
}
