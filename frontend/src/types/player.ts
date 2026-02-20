export type Position =
  | 'C' | '1B' | '2B' | '3B' | 'SS'
  | 'LF' | 'CF' | 'RF' | 'DH' | 'SP' | 'RP';

export interface Player {
  id: string;
  team_id: string;
  name: string;
  position: Position;
  batting_order: number | null;
  is_pitcher: boolean;
}
