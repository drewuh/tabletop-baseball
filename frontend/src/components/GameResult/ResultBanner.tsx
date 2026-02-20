import { TeamInfo } from '../../types/game';

interface ResultBannerProps {
  playerTeam: TeamInfo;
  cpuTeam: TeamInfo;
  playerRuns: number;
  cpuRuns: number;
  playerWon: boolean;
}

export function ResultBanner({ playerTeam, cpuTeam, playerRuns, cpuRuns, playerWon }: ResultBannerProps) {
  return (
    <div
      className={`rounded p-6 text-center ${
        playerWon ? 'bg-emerald-700' : 'bg-red-900'
      }`}
    >
      <div className="font-bold text-3xl text-zinc-100 mb-1">
        {playerWon ? 'Victory!' : 'Defeat'}
      </div>
      <div className="text-zinc-200 text-lg">
        {playerTeam.city} {playerTeam.name} {playerRuns} – {cpuRuns} {cpuTeam.city} {cpuTeam.name}
      </div>
    </div>
  );
}
