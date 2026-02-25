import { useTeamSelect } from '../hooks/useTeamSelect';
import { TeamGrid } from '../components/TeamSelect/TeamGrid';
import { teamThemes, fallbackTheme } from '../lib/teamThemes';

export default function TeamSelectPage() {
  const {
    teams,
    step,
    playerTeamId,
    cpuTeamId,
    isLoading,
    error,
    isConfirming,
    selectPlayerTeam,
    selectCpuTeam,
    goBack,
    confirmSelection,
  } = useTeamSelect();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading teams…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  const playerTheme = playerTeamId ? (teamThemes[playerTeamId] ?? fallbackTheme) : fallbackTheme;
  const opponentTeams = teams.filter(t => t.id !== playerTeamId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 py-12">
      {/* Header */}
      <div className="text-center flex flex-col items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Strat-o-matic Style Simulation
        </span>
        <h1 className="font-bold text-5xl text-zinc-100 tracking-widest uppercase leading-none">
          Tabletop Baseball
        </h1>
        <p className="text-zinc-400 text-sm tracking-wide">
          {step === 1 ? 'Choose your team to start the game' : 'Choose your opponent'}
        </p>
      </div>

      <hr className="w-16 border-t border-zinc-700" />

      {step === 1 && (
        <TeamGrid
          teams={teams}
          selectedTeamId={null}
          onSelectTeam={selectPlayerTeam}
        />
      )}

      {step === 2 && (
        <>
          {/* Back button */}
          <div className="w-full max-w-2xl">
            <button
              onClick={goBack}
              className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <TeamGrid
            teams={opponentTeams}
            selectedTeamId={cpuTeamId}
            onSelectTeam={selectCpuTeam}
          />

          {/* Start Game button */}
          <button
            onClick={confirmSelection}
            disabled={!cpuTeamId || isConfirming}
            className="w-64 py-3 rounded font-bold text-sm tracking-widest uppercase transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: cpuTeamId ? playerTheme.primaryHex : '#3f3f46',
              color: '#f4f4f5',
            }}
          >
            {isConfirming ? 'Starting…' : 'Start Game'}
          </button>
        </>
      )}
    </div>
  );
}
