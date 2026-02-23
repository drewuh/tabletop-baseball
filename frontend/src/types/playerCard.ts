export interface PlayerCardData {
  playerId: string;
  playerName: string;
  position: string;
  teamAbbreviation: string;
  isPitcher: boolean;
  rows: Array<{ col: number; row: number; result: string }>;
}
