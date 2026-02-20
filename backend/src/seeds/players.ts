import { BatterProfile, PitcherProfile } from './cards';

export interface PlayerSeed {
  id: string;
  team_id: string;
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  batter_profile?: BatterProfile;
  pitcher_profile?: PitcherProfile;
}

export const players: PlayerSeed[] = [
  // ── Ironclad Giants ─────────────────────────────────────────
  { id: 'irn-p1',  team_id: 'team-ironclad', name: 'D. Osei',       position: 'SP', batting_order: null, is_pitcher: true,  pitcher_profile: 'ace' },
  { id: 'irn-b1',  team_id: 'team-ironclad', name: 'T. Wren',       position: 'CF', batting_order: 1,    is_pitcher: false, batter_profile: 'speedster' },
  { id: 'irn-b2',  team_id: 'team-ironclad', name: 'C. Okafor',     position: 'SS', batting_order: 2,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'irn-b3',  team_id: 'team-ironclad', name: 'R. Patel',      position: '1B', batting_order: 3,    is_pitcher: false, batter_profile: 'power' },
  { id: 'irn-b4',  team_id: 'team-ironclad', name: 'M. Solis',      position: 'LF', batting_order: 4,    is_pitcher: false, batter_profile: 'power' },
  { id: 'irn-b5',  team_id: 'team-ironclad', name: 'J. Finch',      position: 'RF', batting_order: 5,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'irn-b6',  team_id: 'team-ironclad', name: 'L. Torrez',     position: '3B', batting_order: 6,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'irn-b7',  team_id: 'team-ironclad', name: 'A. Brauer',     position: '2B', batting_order: 7,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'irn-b8',  team_id: 'team-ironclad', name: 'K. Nkosi',      position: 'C',  batting_order: 8,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'irn-b9',  team_id: 'team-ironclad', name: 'P. Lemire',     position: 'DH', batting_order: 9,    is_pitcher: false, batter_profile: 'balanced' },

  // ── Gravel City Hammers ──────────────────────────────────────
  { id: 'grv-p1',  team_id: 'team-gravel', name: 'M. Hargrove',     position: 'SP', batting_order: null, is_pitcher: true,  pitcher_profile: 'groundball' },
  { id: 'grv-b1',  team_id: 'team-gravel', name: 'R. Castellano',   position: 'CF', batting_order: 1,    is_pitcher: false, batter_profile: 'speedster' },
  { id: 'grv-b2',  team_id: 'team-gravel', name: 'D. Voss',         position: 'SS', batting_order: 2,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'grv-b3',  team_id: 'team-gravel', name: 'S. Reinholt',     position: '1B', batting_order: 3,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'grv-b4',  team_id: 'team-gravel', name: 'J. Marra',        position: 'LF', batting_order: 4,    is_pitcher: false, batter_profile: 'power' },
  { id: 'grv-b5',  team_id: 'team-gravel', name: 'F. Dunne',        position: 'RF', batting_order: 5,    is_pitcher: false, batter_profile: 'power' },
  { id: 'grv-b6',  team_id: 'team-gravel', name: 'C. Ayala',        position: '3B', batting_order: 6,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'grv-b7',  team_id: 'team-gravel', name: 'H. Choi',         position: '2B', batting_order: 7,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'grv-b8',  team_id: 'team-gravel', name: 'E. Espinoza',     position: 'C',  batting_order: 8,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'grv-b9',  team_id: 'team-gravel', name: 'T. Farrow',       position: 'DH', batting_order: 9,    is_pitcher: false, batter_profile: 'balanced' },

  // ── Blue Ridge Falcons ───────────────────────────────────────
  { id: 'blr-p1',  team_id: 'team-blueridge', name: 'V. Crane',     position: 'SP', batting_order: null, is_pitcher: true,  pitcher_profile: 'strikeout' },
  { id: 'blr-b1',  team_id: 'team-blueridge', name: 'O. Ruiz',      position: 'CF', batting_order: 1,    is_pitcher: false, batter_profile: 'speedster' },
  { id: 'blr-b2',  team_id: 'team-blueridge', name: 'N. Ashby',     position: 'SS', batting_order: 2,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'blr-b3',  team_id: 'team-blueridge', name: 'G. Vasquez',   position: '1B', batting_order: 3,    is_pitcher: false, batter_profile: 'power' },
  { id: 'blr-b4',  team_id: 'team-blueridge', name: 'W. Nakamura',  position: 'LF', batting_order: 4,    is_pitcher: false, batter_profile: 'power' },
  { id: 'blr-b5',  team_id: 'team-blueridge', name: 'I. Petrov',    position: 'RF', batting_order: 5,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'blr-b6',  team_id: 'team-blueridge', name: 'Y. Dang',      position: '3B', batting_order: 6,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'blr-b7',  team_id: 'team-blueridge', name: 'B. Holloway',  position: '2B', batting_order: 7,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'blr-b8',  team_id: 'team-blueridge', name: 'Z. McAllister', position: 'C', batting_order: 8,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'blr-b9',  team_id: 'team-blueridge', name: 'F. Guerrero',  position: 'DH', batting_order: 9,    is_pitcher: false, batter_profile: 'balanced' },

  // ── Portside Mariners ────────────────────────────────────────
  { id: 'prt-p1',  team_id: 'team-portside', name: 'L. Fontaine',   position: 'SP', batting_order: null, is_pitcher: true,  pitcher_profile: 'average' },
  { id: 'prt-b1',  team_id: 'team-portside', name: 'A. Stroud',     position: 'CF', batting_order: 1,    is_pitcher: false, batter_profile: 'speedster' },
  { id: 'prt-b2',  team_id: 'team-portside', name: 'C. Beaumont',   position: 'SS', batting_order: 2,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'prt-b3',  team_id: 'team-portside', name: 'R. Iglesias',   position: '1B', batting_order: 3,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'prt-b4',  team_id: 'team-portside', name: 'D. Okonkwo',    position: 'LF', batting_order: 4,    is_pitcher: false, batter_profile: 'power' },
  { id: 'prt-b5',  team_id: 'team-portside', name: 'M. Larssen',    position: 'RF', batting_order: 5,    is_pitcher: false, batter_profile: 'power' },
  { id: 'prt-b6',  team_id: 'team-portside', name: 'T. Adeyemi',    position: '3B', batting_order: 6,    is_pitcher: false, batter_profile: 'balanced' },
  { id: 'prt-b7',  team_id: 'team-portside', name: 'S. Pryce',      position: '2B', batting_order: 7,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'prt-b8',  team_id: 'team-portside', name: 'N. Ferraro',    position: 'C',  batting_order: 8,    is_pitcher: false, batter_profile: 'contact' },
  { id: 'prt-b9',  team_id: 'team-portside', name: 'J. Whitmore',   position: 'DH', batting_order: 9,    is_pitcher: false, batter_profile: 'balanced' },
];
