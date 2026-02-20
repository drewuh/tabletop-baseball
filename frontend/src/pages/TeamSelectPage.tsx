import { useTeamSelect } from '../hooks/useTeamSelect';
import { TeamGrid } from '../components/TeamSelect/TeamGrid';
import { ConfirmTeamButton } from '../components/TeamSelect/ConfirmTeamButton';

export default function TeamSelectPage() {
  const { teams, selectedTeamId, isLoading, error, selectTeam, confirmSelection, isConfirming } =
    useTeamSelect();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading teams…
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-8 px-8 py-12">
      <div className="text-center">
        <h1 className="font-bold text-4xl text-zinc-100 tracking-widest uppercase">
          Tabletop Baseball
        </h1>
        <p className="text-zinc-400 mt-2">Select your team</p>
      </div>
      <TeamGrid teams={teams} selectedTeamId={selectedTeamId} onSelectTeam={selectTeam} />
      <ConfirmTeamButton
        disabled={!selectedTeamId}
        isConfirming={isConfirming}
        onConfirm={confirmSelection}
      />
    </div>
  );
}
