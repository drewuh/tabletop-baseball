import type { BaseRunners } from '../../types/game';

interface DiamondViewProps {
  baseRunners: BaseRunners;
  outs: number;
  accentHex?: string;
}

interface BaseSquareProps {
  occupied: boolean;
  accentHex: string;
  positionClasses: string;
}

function BaseSquare({ occupied, accentHex, positionClasses }: BaseSquareProps) {
  return (
    <div
      className={`absolute w-5 h-5 rotate-45 border transition-colors duration-500 ${positionClasses} ${
        occupied ? 'animate-pulse border-transparent' : 'bg-zinc-700 border-zinc-500'
      }`}
      style={occupied ? { backgroundColor: accentHex } : undefined}
    />
  );
}

export function DiamondView({ baseRunners, outs, accentHex = '#f59e0b' }: DiamondViewProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Diamond */}
      <div className="relative w-48 h-48 mx-auto">
        {/* Base lines */}
        {/* 2B to 1B */}
        <div
          className="absolute bg-zinc-600"
          style={{ width: '2px', height: '96px', top: '18px', left: '50%', transformOrigin: 'top center', transform: 'translateX(-50%) rotate(45deg)' }}
        />
        {/* 2B to 3B */}
        <div
          className="absolute bg-zinc-600"
          style={{ width: '2px', height: '96px', top: '18px', left: '50%', transformOrigin: 'top center', transform: 'translateX(-50%) rotate(-45deg)' }}
        />
        {/* 3B to Home */}
        <div
          className="absolute bg-zinc-600"
          style={{ width: '2px', height: '96px', bottom: '18px', left: '50%', transformOrigin: 'bottom center', transform: 'translateX(-50%) rotate(45deg)' }}
        />
        {/* 1B to Home */}
        <div
          className="absolute bg-zinc-600"
          style={{ width: '2px', height: '96px', bottom: '18px', left: '50%', transformOrigin: 'bottom center', transform: 'translateX(-50%) rotate(-45deg)' }}
        />

        {/* 2nd base — top center */}
        <BaseSquare
          occupied={baseRunners.second}
          accentHex={accentHex}
          positionClasses="top-2 left-1/2 -translate-x-1/2"
        />
        {/* 1st base — right middle */}
        <BaseSquare
          occupied={baseRunners.first}
          accentHex={accentHex}
          positionClasses="top-1/2 right-4 -translate-y-1/2"
        />
        {/* 3rd base — left middle */}
        <BaseSquare
          occupied={baseRunners.third}
          accentHex={accentHex}
          positionClasses="top-1/2 left-4 -translate-y-1/2"
        />
        {/* Home plate — bottom center */}
        <div className="absolute w-5 h-5 rotate-45 bg-zinc-600 border border-zinc-500 bottom-2 left-1/2 -translate-x-1/2" />
      </div>

      {/* Outs */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">OUTS</span>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < outs ? 'bg-amber-400' : 'bg-zinc-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
