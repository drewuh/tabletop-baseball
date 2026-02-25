interface PlayByPlayInningDividerProps {
  inning: number;
  half: 'top' | 'bottom';
}

function ordinalSuffix(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

export function PlayByPlayInningDivider({ inning, half }: PlayByPlayInningDividerProps) {
  const label = `${half === 'top' ? 'Top' : 'Bottom'} ${ordinalSuffix(inning)}`;
  return (
    <div className="text-zinc-600 text-xs font-semibold uppercase tracking-widest py-1.5 border-t border-zinc-700 mt-1">
      {label}
    </div>
  );
}
