import { useState } from 'react';
import type { GeneratedPlayer } from '../../types/editor';
import { SimulatedBadge } from './SimulatedBadge';

interface GeneratedRosterReviewProps {
  teamId: string;
  players: GeneratedPlayer[];
  isSimulated: boolean;
  onDiscard: () => void;
  onAccept: () => void;
}

export function GeneratedRosterReview({ teamId, players, isSimulated, onDiscard, onAccept }: GeneratedRosterReviewProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setIsAccepting(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${teamId}/bulk-players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(players),
      });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setError(body.error ?? 'Failed to save roster.');
        return;
      }
      onAccept();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  }

  return (
    <div className="border border-zinc-700 rounded-xl bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-zinc-100 font-semibold text-sm">Generated Roster</span>
          {isSimulated && <SimulatedBadge />}
        </div>
        <span className="text-zinc-500 text-xs">{players.length} players</span>
      </div>

      {/* Player list */}
      <div className="divide-y divide-zinc-800">
        {players.map(p => (
          <div key={p.id} className="px-4 py-2.5 flex items-center justify-between">
            <div>
              <span className="text-zinc-100 text-sm font-medium">{p.name}</span>
              <span className="ml-2 text-zinc-500 text-xs">{p.position}</span>
            </div>
            <span className="text-zinc-600 text-xs font-mono capitalize">{p.archetype}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-zinc-800 border-t border-zinc-700 flex items-center justify-between gap-3">
        {error && <p className="text-red-400 text-xs flex-1">{error}</p>}
        <div className="flex gap-3 ml-auto">
          <button
            onClick={onDiscard}
            disabled={isAccepting}
            className="min-h-[44px] px-4 py-2 border border-zinc-600 text-zinc-400 hover:text-zinc-200 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={accept}
            disabled={isAccepting}
            className="min-h-[44px] px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAccepting ? 'Saving…' : 'Accept Roster'}
          </button>
        </div>
      </div>
    </div>
  );
}
