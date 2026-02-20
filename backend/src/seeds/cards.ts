import { PlayResultType } from '../services/gameEngine';

export interface CardRow {
  d6_sum: number;
  result: PlayResultType;
}

// d20 1-10 = batter card, 11-20 = pitcher card
// d6_sum ranges from 2 to 12

export type BatterProfile = 'power' | 'contact' | 'balanced' | 'speedster';
export type PitcherProfile = 'ace' | 'groundball' | 'strikeout' | 'average';

export function buildBatterCard(profile: BatterProfile): CardRow[] {
  const tables: Record<BatterProfile, PlayResultType[]> = {
    // Index 0 = d6_sum 2, index 10 = d6_sum 12
    power: [
      'HOME_RUN',   // 2
      'STRIKEOUT',  // 3
      'STRIKEOUT',  // 4
      'GROUND_OUT', // 5
      'GROUND_OUT', // 6
      'FLY_OUT',    // 7
      'SINGLE',     // 8
      'SINGLE',     // 9
      'DOUBLE',     // 10
      'HOME_RUN',   // 11
      'WALK',       // 12
    ],
    contact: [
      'DOUBLE',     // 2
      'SINGLE',     // 3
      'SINGLE',     // 4
      'GROUND_OUT', // 5
      'GROUND_OUT', // 6
      'SINGLE',     // 7
      'FLY_OUT',    // 8
      'SINGLE',     // 9
      'WALK',       // 10
      'STRIKEOUT',  // 11
      'TRIPLE',     // 12
    ],
    balanced: [
      'HOME_RUN',   // 2
      'STRIKEOUT',  // 3
      'GROUND_OUT', // 4
      'SINGLE',     // 5
      'GROUND_OUT', // 6
      'FLY_OUT',    // 7
      'SINGLE',     // 8
      'WALK',       // 9
      'DOUBLE',     // 10
      'STRIKEOUT',  // 11
      'SINGLE',     // 12
    ],
    speedster: [
      'TRIPLE',     // 2
      'SINGLE',     // 3
      'GROUND_OUT', // 4
      'SINGLE',     // 5
      'GROUND_OUT', // 6
      'SINGLE',     // 7
      'FLY_OUT',    // 8
      'WALK',       // 9
      'SINGLE',     // 10
      'STRIKEOUT',  // 11
      'DOUBLE',     // 12
    ],
  };

  return tables[profile].map((result, i) => ({
    d6_sum: i + 2,
    result,
  }));
}

export function buildPitcherCard(profile: PitcherProfile): CardRow[] {
  const tables: Record<PitcherProfile, PlayResultType[]> = {
    ace: [
      'STRIKEOUT',  // 2
      'STRIKEOUT',  // 3
      'GROUND_OUT', // 4
      'GROUND_OUT', // 5
      'FLY_OUT',    // 6
      'GROUND_OUT', // 7
      'STRIKEOUT',  // 8
      'FLY_OUT',    // 9
      'SINGLE',     // 10
      'WALK',       // 11
      'HOME_RUN',   // 12
    ],
    groundball: [
      'GROUND_OUT', // 2
      'GROUND_OUT', // 3
      'GROUND_OUT', // 4
      'STRIKEOUT',  // 5
      'GROUND_OUT', // 6
      'FLY_OUT',    // 7
      'GROUND_OUT', // 8
      'SINGLE',     // 9
      'WALK',       // 10
      'DOUBLE',     // 11
      'SINGLE',     // 12
    ],
    strikeout: [
      'STRIKEOUT',  // 2
      'STRIKEOUT',  // 3
      'STRIKEOUT',  // 4
      'GROUND_OUT', // 5
      'FLY_OUT',    // 6
      'STRIKEOUT',  // 7
      'GROUND_OUT', // 8
      'SINGLE',     // 9
      'WALK',       // 10
      'STRIKEOUT',  // 11
      'HOME_RUN',   // 12
    ],
    average: [
      'DOUBLE',     // 2
      'STRIKEOUT',  // 3
      'GROUND_OUT', // 4
      'GROUND_OUT', // 5
      'FLY_OUT',    // 6
      'SINGLE',     // 7
      'GROUND_OUT', // 8
      'WALK',       // 9
      'STRIKEOUT',  // 10
      'SINGLE',     // 11
      'HOME_RUN',   // 12
    ],
  };

  return tables[profile].map((result, i) => ({
    d6_sum: i + 2,
    result,
  }));
}
