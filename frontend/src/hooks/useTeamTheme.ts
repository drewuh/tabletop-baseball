import type { TeamTheme } from '../types/theme';
import { teamThemes, fallbackTheme } from '../lib/teamThemes';

function deriveTheme(primaryColor: string): TeamTheme {
  return { primaryHex: primaryColor, accentHex: primaryColor };
}

export function useTeamTheme(
  homeTeamId: string,
  awayTeamId: string,
  homePrimaryColor?: string,
  awayPrimaryColor?: string,
): { homeTheme: TeamTheme; awayTheme: TeamTheme } {
  const homeTheme =
    teamThemes[homeTeamId] ??
    (homePrimaryColor ? deriveTheme(homePrimaryColor) : fallbackTheme);
  const awayTheme =
    teamThemes[awayTeamId] ??
    (awayPrimaryColor ? deriveTheme(awayPrimaryColor) : fallbackTheme);
  return { homeTheme, awayTheme };
}
