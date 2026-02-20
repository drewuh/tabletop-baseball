import type { PlayResult, PlayResultType } from '../../types/game';

interface PlayResultDisplayProps {
  result: PlayResult | null;
}

function resultColor(type: PlayResultType): string {
  if (['SINGLE', 'DOUBLE', 'TRIPLE', 'HOME_RUN'].includes(type)) return 'text-emerald-400';
  if (['STRIKEOUT', 'GROUND_OUT', 'FLY_OUT', 'LINE_OUT'].includes(type)) return 'text-red-400';
  return 'text-zinc-300';
}

function resultLabel(type: PlayResultType): string {
  return type.replace('_', ' ');
}

export function PlayResultDisplay({ result }: PlayResultDisplayProps) {
  if (!result) return <div className="h-14" />;

  return (
    <div className="text-center transition-opacity duration-300">
      <div className={`font-bold text-lg ${resultColor(result.type)}`}>
        {resultLabel(result.type)}
      </div>
      <div className="text-zinc-300 text-sm mt-1">{result.description}</div>
    </div>
  );
}
