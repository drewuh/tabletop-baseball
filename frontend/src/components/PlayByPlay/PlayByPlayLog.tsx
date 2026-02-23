import { useEffect, useRef } from 'react';
import type { GameLogEntry } from '../../types/game';
import { PlayByPlayEntry } from './PlayByPlayEntry';
import { PlayByPlayInningDivider } from './PlayByPlayInningDivider';

interface PlayByPlayLogProps {
  entries: GameLogEntry[];
  isLive: boolean;
}

interface EntryGroup {
  inning: number;
  half: 'top' | 'bottom';
  entries: GameLogEntry[];
}

function groupEntries(entries: GameLogEntry[]): EntryGroup[] {
  const groups: EntryGroup[] = [];

  for (const entry of entries) {
    const half: 'top' | 'bottom' = entry.is_top === 1 ? 'top' : 'bottom';
    const last = groups[groups.length - 1];
    if (last && last.inning === entry.inning && last.half === half) {
      last.entries.push(entry);
    } else {
      groups.push({ inning: entry.inning, half, entries: [entry] });
    }
  }

  return groups;
}

export function PlayByPlayLog({ entries, isLive }: PlayByPlayLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLive) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [entries.length, isLive]);

  const groups = groupEntries(entries);

  return (
    <div className={`overflow-y-auto ${isLive ? 'max-h-80' : 'max-h-96'}`}>
      {groups.map((group, gi) => (
        <div key={`${group.inning}-${group.half}`}>
          <PlayByPlayInningDivider inning={group.inning} half={group.half} />
          {group.entries.map(entry => (
            <PlayByPlayEntry key={entry.id} entry={entry} />
          ))}
          {/* Spacer between groups */}
          {gi < groups.length - 1 && <div className="mb-1" />}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
