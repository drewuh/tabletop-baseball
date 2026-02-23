import type { GameLogEntry } from '../../types/game';
import { PlayByPlayLog } from './PlayByPlayLog';

interface PlayByPlayPanelProps {
  entries: GameLogEntry[];
  isLive: boolean;
}

export function PlayByPlayPanel({ entries, isLive }: PlayByPlayPanelProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex flex-col">
      <div className="text-zinc-100 font-semibold text-sm mb-3">Play-by-Play</div>
      <PlayByPlayLog entries={entries} isLive={isLive} />
    </div>
  );
}
