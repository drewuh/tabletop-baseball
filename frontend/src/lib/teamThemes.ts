import type { TeamTheme } from '../types/theme';

export const teamThemes: Record<string, TeamTheme> = {
  'team-ironclad': { primaryHex: '#1e3a5f', accentHex: '#c0a060' },
  'team-gravel':   { primaryHex: '#5a2d0c', accentHex: '#d4a017' },
  'team-blueridge': { primaryHex: '#003366', accentHex: '#99ccff' },
  'team-portside':  { primaryHex: '#004d40', accentHex: '#80cbc4' },
};

export const fallbackTheme: TeamTheme = {
  primaryHex: '#f59e0b',
  accentHex: '#fbbf24',
};
