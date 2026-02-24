import { Link, useParams, useSearchParams } from 'react-router-dom';
import { usePlayerForm } from '../hooks/usePlayerForm';
import { PlayerForm } from '../components/Editor/PlayerForm';
import { CardEditor } from '../components/Editor/CardEditor';

export default function PlayerFormPage() {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();

  const isNew = id === 'new' || id === undefined;
  const playerId = isNew ? undefined : id;
  const teamId = searchParams.get('teamId') ?? '';

  const { form, setField, setCard, isLoading, isSubmitting, submitError, submit } =
    usePlayerForm({ teamId, playerId });

  const backTo = teamId ? `/editor/teams/${teamId}` : '/editor';

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center text-zinc-400">Loading…</div>;
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <Link to={backTo} className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100 mt-3">
          {playerId ? 'Edit Player' : 'New Player'}
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Player details */}
        <PlayerForm
          form={form}
          onField={setField}
          submitError={null}
        />

        {/* Card editor */}
        <div>
          <h2 className="text-base font-semibold text-zinc-100 mb-3">Player Card</h2>
          <p className="text-zinc-500 text-xs mb-4">
            All 36 cells required. Tap (mobile) or use dropdowns (desktop) to set each result.
          </p>
          <CardEditor value={form.card} onChange={setCard} />
        </div>

        {/* Submit error + button */}
        {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
        <div>
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="min-h-[44px] px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Saving…' : playerId ? 'Save Changes' : 'Create Player'}
          </button>
        </div>
      </div>
    </div>
  );
}
