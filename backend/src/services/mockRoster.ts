import type { PlayerCreateInput, CardRow } from '../models/team';

// Card layouts validated against stat bounds:
//   Batters:  max 3 HOME_RUN, max 4 STRIKEOUT, min 8 total outs (GO+FO+LO)
//   Pitchers: min 12 STRIKEOUT, max 2 HOME_RUN, min 18 total outs

type Result = CardRow['result'];

function makeCard(cells: Result[]): CardRow[] {
  // cells is col-major: index = (col-1)*6 + (row-1)
  const rows: CardRow[] = [];
  for (let col = 1; col <= 6; col++) {
    for (let row = 1; row <= 6; row++) {
      rows.push({ col, row, result: cells[(col - 1) * 6 + (row - 1)] });
    }
  }
  return rows;
}

// Balanced batter: 2 HR, 3 K, 12 outs (6 GO + 6 FO), rest hits/walks
const BALANCED_BATTER = makeCard([
  // col1
  'HOME_RUN','STRIKEOUT','GROUND_OUT','SINGLE','SINGLE','FLY_OUT',
  // col2
  'HOME_RUN','STRIKEOUT','GROUND_OUT','DOUBLE','SINGLE','FLY_OUT',
  // col3
  'SINGLE','STRIKEOUT','GROUND_OUT','DOUBLE','WALK','FLY_OUT',
  // col4
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','WALK','FLY_OUT',
  // col5
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','FLY_OUT','DOUBLE',
  // col6
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','FLY_OUT','WALK',
]);

// Contact batter: 0 HR, 2 K, 10 outs (6 GO + 4 FO), heavy singles
const CONTACT_BATTER = makeCard([
  // col1
  'SINGLE','SINGLE','SINGLE','GROUND_OUT','DOUBLE','SINGLE',
  // col2
  'SINGLE','SINGLE','GROUND_OUT','DOUBLE','WALK','SINGLE',
  // col3
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','FLY_OUT','STRIKEOUT',
  // col4
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','FLY_OUT','STRIKEOUT',
  // col5
  'SINGLE','SINGLE','GROUND_OUT','FLY_OUT','WALK','SINGLE',
  // col6
  'SINGLE','TRIPLE','GROUND_OUT','FLY_OUT','SINGLE','SINGLE',
]);

// Power batter: 3 HR, 4 K, 9 outs (5 GO + 4 FO), some doubles
const POWER_BATTER = makeCard([
  // col1
  'HOME_RUN','HOME_RUN','STRIKEOUT','GROUND_OUT','DOUBLE','FLY_OUT',
  // col2
  'STRIKEOUT','STRIKEOUT','GROUND_OUT','DOUBLE','FLY_OUT','SINGLE',
  // col3
  'HOME_RUN','STRIKEOUT','GROUND_OUT','DOUBLE','FLY_OUT','SINGLE',
  // col4
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','DOUBLE','SINGLE',
  // col5
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','SINGLE','WALK',
  // col6
  'SINGLE','WALK','FLY_OUT','SINGLE','SINGLE','DOUBLE',
]);

// Speedster batter: 0 HR, 2 K, 8 outs (5 GO + 3 FO), lots of singles + triples
const SPEEDSTER_BATTER = makeCard([
  // col1
  'SINGLE','SINGLE','SINGLE','GROUND_OUT','SINGLE','FLY_OUT',
  // col2
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','WALK','FLY_OUT',
  // col3
  'TRIPLE','SINGLE','GROUND_OUT','SINGLE','SINGLE','FLY_OUT',
  // col4
  'SINGLE','SINGLE','GROUND_OUT','SINGLE','DOUBLE','STRIKEOUT',
  // col5
  'SINGLE','TRIPLE','GROUND_OUT','SINGLE','SINGLE','STRIKEOUT',
  // col6
  'SINGLE','SINGLE','SINGLE','WALK','DOUBLE','SINGLE',
]);

// Strikeout pitcher: 18 K, 0 HR, 18 outs (10 GO + 8 FO)
const STRIKEOUT_PITCHER = makeCard([
  // col1
  'STRIKEOUT','STRIKEOUT','STRIKEOUT','STRIKEOUT','GROUND_OUT','GROUND_OUT',
  // col2
  'STRIKEOUT','STRIKEOUT','STRIKEOUT','STRIKEOUT','GROUND_OUT','GROUND_OUT',
  // col3
  'STRIKEOUT','STRIKEOUT','STRIKEOUT','STRIKEOUT','GROUND_OUT','FLY_OUT',
  // col4
  'STRIKEOUT','STRIKEOUT','GROUND_OUT','GROUND_OUT','FLY_OUT','FLY_OUT',
  // col5
  'GROUND_OUT','GROUND_OUT','GROUND_OUT','FLY_OUT','FLY_OUT','SINGLE',
  // col6
  'GROUND_OUT','FLY_OUT','FLY_OUT','FLY_OUT','SINGLE','DOUBLE',
]);

type BatterArchetype = 'power' | 'contact' | 'balanced' | 'speedster';

const BATTER_CARDS: Record<BatterArchetype, CardRow[]> = {
  power: POWER_BATTER,
  contact: CONTACT_BATTER,
  balanced: BALANCED_BATTER,
  speedster: SPEEDSTER_BATTER,
};

// Fictional name pools — varied for diversity
const FIRST_NAMES = [
  'Marcus','Delia','Theo','Carmen','Hiro','Vera','Colt','Nadia',
  'Juno','Rex','Willa','Dash','Sable','Orion','Petra','Flynn',
];
const LAST_NAMES = [
  'Ashford','Castillo','Navarro','Winters','Okafor','Hensley',
  'Brix','Valdez','Crane','Munroe','Stokes','Whitmore',
  'Tran','Delgado','Firth','Osei',
];

function pickName(seed: number): string {
  return `${FIRST_NAMES[seed % FIRST_NAMES.length]} ${LAST_NAMES[(seed * 3 + 7) % LAST_NAMES.length]}`;
}

const BATTER_POSITIONS = ['C','1B','2B','3B','SS','LF','CF','RF','DH'] as const;
const BATTER_ARCHETYPES: BatterArchetype[] = [
  'contact','power','balanced','speedster',
  'contact','balanced','speedster','power','contact',
];

export function buildMockRoster(
  abbreviation: string,
  _city: string,
  _teamName: string,
): PlayerCreateInput[] {
  const abbr = abbreviation.toLowerCase();
  const players: PlayerCreateInput[] = [];

  // 9 batters
  for (let i = 0; i < 9; i++) {
    const pos = BATTER_POSITIONS[i];
    const archetype = BATTER_ARCHETYPES[i];
    players.push({
      id: `${abbr}-b${i + 1}`,
      team_id: '',                // caller sets team_id via route param
      name: pickName(i + 1),
      position: pos,
      batting_order: i + 1,
      is_pitcher: false,
      card: BATTER_CARDS[archetype],
    });
  }

  // 1 SP
  players.push({
    id: `${abbr}-p1`,
    team_id: '',
    name: pickName(10),
    position: 'SP',
    batting_order: null,
    is_pitcher: true,
    card: STRIKEOUT_PITCHER,
  });

  return players;
}
