export interface PlayerCardData {
  playerId: string;
  playerName: string;
  position: string;
  teamAbbreviation: string;
  isPitcher: boolean;
  rows: Array<{ d6_sum: number; result: string }>;
}
