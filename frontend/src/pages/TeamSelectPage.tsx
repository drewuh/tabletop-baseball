import { useTeamSelect } from '../hooks/useTeamSelect';
import { TeamGrid } from '../components/TeamSelect/TeamGrid';
import { ConfirmTeamButton } from '../components/TeamSelect/ConfirmTeamButton';

export default function TeamSelectPage() {
  const { teams, selectedTeamId, isLoading, error, selectTeam, confirmSelection, isConfirming } =
    useTeamSelect();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading teams\u2026
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-10 px-8 py-12">
      <div className="text-center flex flex-col items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Strat-o-matic Style Simulation
        </span>
        <h1 className="font-bold text-5xl text-zinc-100 tracking-widest uppercase leading-none">
          Tabletop Baseball
        </h1>
        <p className="text-zinc-400 text-sm tracking-wide">
          Choose your team to start the game
        </p>
      </div>
      <hr className="w-16 border-t border-zinc-700" />
      <TeamGrid teams={teams} selectedTeamId={selectedTeamId} onSelectTeam={selectTeam} />
      <ConfirmTeamButton
        disabled={!selectedTeamId}
        isConfirming={isConfirming}
        onConfirm={confirmSelection}
        selectedTeamId={selectedTeamId}
      />
    </div>
  );
}
