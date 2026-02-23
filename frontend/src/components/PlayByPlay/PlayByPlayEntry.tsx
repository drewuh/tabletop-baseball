import type { GameLogEntry } from '../../types/game';

interface PlayByPlayEntryProps {
  entry: GameLogEntry;
}

function entryColor(type: string): string {
  switch (type) {
    case 'hit':    return 'text-green-400';
    case 'run':    return 'text-amber-300';
    case 'walk':   return 'text-sky-400';
    case 'out':    return 'text-zinc-400';
    case 'inning': return 'text-zinc-300 font-semibold';
    case 'info':   return 'text-zinc-500 italic';
    default:       return 'text-zinc-500';
  }
}

export function PlayByPlayEntry({ entry }: PlayByPlayEntryProps) {
  return (
    <div className={`text-xs py-0.5 ${entryColor(entry.entry_type)}`}>
      {entry.text}
    </div>
  );
}
