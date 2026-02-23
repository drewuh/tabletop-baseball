import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import '../../styles/dice.css';

interface DieProps {
  sides: 6 | 20;
  value: number | null;
  isRolling: boolean;
  accentHex?: string;
}

const VARIANTS = ['a', 'b', 'c'] as const;
type Variant = (typeof VARIANTS)[number];

export function Die({ sides, value, isRolling, accentHex }: DieProps) {
  const label = sides === 20 ? 'D20' : 'D6';
  const [variant, setVariant] = useState<Variant>('a');
  const [rollDuration, setRollDuration] = useState(1000);

  useEffect(() => {
    if (isRolling) {
      setVariant(VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
      setRollDuration(900 + Math.floor(Math.random() * 200));
    }
  }, [isRolling]);

  const isSettled = !isRolling && value !== null;
  const animationClass = isRolling
    ? `dice-roll-${variant}`
    : isSettled
      ? 'dice-settle'
      : '';

  const rollVars = { '--roll-duration': `${rollDuration}ms` } as CSSProperties;
  const frontStyle: CSSProperties = isSettled && accentHex ? { borderColor: accentHex } : {};

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="dice-scene">
        <div className={`dice-cube ${animationClass}`} style={rollVars}>
          <div className="dice-face dice-face--front" style={frontStyle}>
            <span className="dice-pip">{isRolling ? '?' : (value ?? '—')}</span>
          </div>
          <div className="dice-face dice-face--back">
            <span className="dice-pip">{isRolling ? '?' : ''}</span>
          </div>
          <div className="dice-face dice-face--right">
            <span className="dice-pip">{isRolling ? '?' : ''}</span>
          </div>
          <div className="dice-face dice-face--left">
            <span className="dice-pip">{isRolling ? '?' : ''}</span>
          </div>
          <div className="dice-face dice-face--top">
            <span className="dice-pip">{isRolling ? '?' : ''}</span>
          </div>
          <div className="dice-face dice-face--bottom">
            <span className="dice-pip">{isRolling ? '?' : ''}</span>
          </div>
        </div>
      </div>
      <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">{label}</span>
    </div>
  );
}
