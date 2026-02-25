import { useEffect, useRef } from 'react';
import type { GameLogEntry } from '../../types/game';

interface GameLogProps {
  entries: GameLogEntry[];
}

function entryColor(type: string): string {
  switch (type) {
    case 'hit': return 'text-emerald-400';
    case 'run': return 'text-amber-400';
    case 'walk': return 'text-sky-400';
    case 'out': return 'text-zinc-400';
    case 'inning': return 'text-zinc-300 font-bold';
    default: return 'text-zinc-500';
  }
}

export function GameLog({ entries }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="border border-zinc-700 rounded bg-zinc-900">
      <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest px-3 py-1 border-b border-zinc-700">
        Game Log
      </div>
      <div className="h-36 overflow-y-auto px-3 py-2 flex flex-col gap-0.5">
        {entries.map(entry => (
          <div key={entry.id} className={`text-xs font-mono ${entryColor(entry.entry_type)}`}>
            {entry.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
