export interface CompletedGame {
  gameId: string;
  playedAt: string;
  homeTeam: { id: string; name: string; abbreviation: string; primaryColor: string };
  awayTeam: { id: string; name: string; abbreviation: string; primaryColor: string };
  homeScore: number;
  awayScore: number;
}
