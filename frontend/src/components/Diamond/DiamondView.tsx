import { BaseRunners } from '../../types/game';

interface DiamondViewProps {
  baseRunners: BaseRunners;
  outs: number;
}

function Base({ occupied, label }: { occupied: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-6 h-6 rotate-45 border ${
          occupied ? 'bg-amber-400 border-amber-400' : 'bg-zinc-700 border-zinc-500'
        }`}
      />
      <span className="text-xs text-zinc-400 font-mono">{label}</span>
    </div>
  );
}

export function DiamondView({ baseRunners, outs }: DiamondViewProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center gap-3">
        {/* 2B */}
        <Base occupied={baseRunners.second} label="2B" />
        {/* 3B and 1B */}
        <div className="flex gap-12">
          <Base occupied={baseRunners.third} label="3B" />
          <Base occupied={baseRunners.first} label="1B" />
        </div>
        {/* Home */}
        <div className="w-6 h-6 rotate-45 border border-zinc-500 bg-zinc-600" />
      </div>
      {/* Outs */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Outs</span>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < outs ? 'bg-amber-400' : 'bg-zinc-700'}`}
          />
        ))}
      </div>
    </div>
  );
}
