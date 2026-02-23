import type { TeamInfo } from '../../types/game';
import type { TeamTheme } from '../../types/theme';

interface ResultBannerProps {
  playerTeam: TeamInfo;
  cpuTeam: TeamInfo;
  playerRuns: number;
  cpuRuns: number;
  playerWon: boolean;
  playerTheme?: TeamTheme;
}

export function ResultBanner({ playerTeam, cpuTeam, playerRuns, cpuRuns, playerWon, playerTheme }: ResultBannerProps) {
  const scoreLine = (
    <div className="text-zinc-200 text-lg">
      {playerTeam.city} {playerTeam.name} {playerRuns} – {cpuRuns} {cpuTeam.city} {cpuTeam.name}
    </div>
  );

  if (playerWon) {
    if (playerTheme) {
      return (
        <div
          className="rounded p-6 text-center"
          style={{ backgroundColor: playerTheme.primaryHex }}
        >
          <div className="font-bold text-3xl text-zinc-100 mb-1">Victory!</div>
          {scoreLine}
        </div>
      );
    }
    return (
      <div className="rounded p-6 text-center bg-emerald-700">
        <div className="font-bold text-3xl text-zinc-100 mb-1">Victory!</div>
        {scoreLine}
      </div>
    );
  }

  if (playerTheme) {
    return (
      <div className="rounded p-6 text-center relative overflow-hidden bg-red-950">
        <div
          className="absolute inset-0 opacity-60"
          style={{ backgroundColor: playerTheme.primaryHex }}
        />
        <div className="relative">
          <div className="font-bold text-3xl text-zinc-100 mb-1">Defeat</div>
          {scoreLine}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded p-6 text-center bg-red-900">
      <div className="font-bold text-3xl text-zinc-100 mb-1">Defeat</div>
      {scoreLine}
    </div>
  );
}
