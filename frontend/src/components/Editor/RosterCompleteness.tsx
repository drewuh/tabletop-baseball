import type { RosterStatus } from '../../types/editor';

interface RosterCompletenessProps {
  status: RosterStatus;
}

export function RosterCompleteness({ status }: RosterCompletenessProps) {
  const { battersFilled, battersNeeded, pitchersFilled, pitchersNeeded, isComplete } = status;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
      isComplete
        ? 'bg-green-900/50 text-green-400 border border-green-700'
        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
    }`}>
      <span
        className={`w-2 h-2 rounded-full ${isComplete ? 'bg-green-400' : 'bg-zinc-500'}`}
      />
      {battersFilled}/{battersNeeded} batters · {pitchersFilled}/{pitchersNeeded} SP
      {isComplete && <span className="ml-1">✓</span>}
    </div>
  );
}
