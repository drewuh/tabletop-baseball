import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTeamEditorDetail } from '../hooks/useTeamEditorDetail';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';
import { useRosterGeneration } from '../hooks/useRosterGeneration';
import { PlayerList } from '../components/Editor/PlayerList';
import { RosterCompleteness } from '../components/Editor/RosterCompleteness';
import { AddPlayerButton } from '../components/Editor/AddPlayerButton';
import { DeleteTeamButton } from '../components/Editor/DeleteTeamButton';
import { DeleteConfirmModal } from '../components/Editor/DeleteConfirmModal';
import { GenerateRosterButton } from '../components/Editor/GenerateRosterButton';
import { GeneratedRosterReview } from '../components/Editor/GeneratedRosterReview';
import { getRosterStatus } from '../types/editor';

export default function TeamEditorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const teamId = id ?? '';

  const { team, players, isLoading, error, reload } = useTeamEditorDetail(teamId);

  const { isOpen, isDeleting, error: deleteError, open: openDelete, close: closeDelete, confirm: confirmDelete } =
    useDeleteConfirm(async () => {
      const res = await fetch(`/api/teams/${teamId}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? 'Delete failed.');
      }
      navigate('/editor');
    });

  const { generate, isLoading: isGenerating, generatedRoster, isSimulated, error: genError, reset: resetGen } =
    useRosterGeneration(teamId);

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center text-zinc-400">Loading…</div>;
  }

  if (error || !team) {
    return <div className="flex-1 flex items-center justify-center text-red-400">{error ?? 'Team not found.'}</div>;
  }

  const rosterStatus = getRosterStatus(players);

  function handleRosterAccepted() {
    reload();
    resetGen();
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
      {/* Back */}
      <Link to="/editor" className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
        ← All Teams
      </Link>

      {/* Team header */}
      <div className="flex items-start justify-between mt-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-10 rounded shrink-0"
            style={{ backgroundColor: team.primary_color }}
          />
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">
              {team.city} {team.name}
            </h1>
            <div className="text-zinc-500 text-sm mt-0.5">{team.abbreviation}</div>
          </div>
        </div>
        <Link
          to={`/editor/teams/${teamId}/edit`}
          className="min-h-[44px] px-4 py-2 border border-zinc-600 text-zinc-300 hover:text-zinc-100 rounded text-sm font-medium transition-colors flex items-center shrink-0"
        >
          Edit Info
        </Link>
      </div>

      {/* Roster section */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">Roster</h2>
          <RosterCompleteness status={rosterStatus} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <GenerateRosterButton onGenerate={generate} isLoading={isGenerating} />
          <AddPlayerButton teamId={teamId} />
        </div>
      </div>

      {genError && (
        <p className="text-red-400 text-sm mb-3">{genError}</p>
      )}

      {/* Generated roster review */}
      {generatedRoster && (
        <div className="mb-6">
          <GeneratedRosterReview
            teamId={teamId}
            players={generatedRoster}
            isSimulated={isSimulated}
            onDiscard={resetGen}
            onAccept={handleRosterAccepted}
          />
        </div>
      )}

      <PlayerList players={players} />

      {/* Danger zone */}
      <div className="mt-10 pt-6 border-t border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
          Danger Zone
        </h3>
        <DeleteTeamButton onDelete={openDelete} />
      </div>

      <DeleteConfirmModal
        isOpen={isOpen}
        isDeleting={isDeleting}
        error={deleteError}
        entityLabel={`${team.city} ${team.name}`}
        onConfirm={confirmDelete}
        onClose={closeDelete}
      />
    </div>
  );
}
