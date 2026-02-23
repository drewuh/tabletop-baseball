import type { TeamTheme } from '../types/theme';
import { teamThemes, fallbackTheme } from '../lib/teamThemes';

export function useTeamTheme(
  homeTeamId: string,
  awayTeamId: string,
): { homeTheme: TeamTheme; awayTheme: TeamTheme } {
  const homeTheme = teamThemes[homeTeamId] ?? fallbackTheme;
  const awayTheme = teamThemes[awayTeamId] ?? fallbackTheme;
  return { homeTheme, awayTheme };
}
