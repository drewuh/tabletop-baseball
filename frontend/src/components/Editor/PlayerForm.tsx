import { ALL_POSITIONS, BATTER_POSITIONS } from '../../types/editor';
import type { CardGrid } from '../../types/editor';

interface PlayerFormFields {
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  card: CardGrid;
}

interface PlayerFormProps {
  form: PlayerFormFields;
  onField: <K extends keyof PlayerFormFields>(key: K, value: PlayerFormFields[K]) => void;
  submitError: string | null;
}

export function PlayerForm({ form, onField, submitError }: PlayerFormProps) {
  const isBatter = !form.is_pitcher;

  function handlePosition(pos: string) {
    const isPitcher = pos === 'SP';
    onField('position', pos);
    onField('is_pitcher', isPitcher as PlayerFormFields['is_pitcher']);
    if (isPitcher) onField('batting_order', null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Player Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => onField('name', e.target.value)}
          placeholder="Marcus Ashford"
          className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* Position */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Position</label>
        <select
          value={form.position}
          onChange={e => handlePosition(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
        >
          {ALL_POSITIONS.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      {/* Batting order — batters only */}
      {isBatter && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
            Batting Order (1–9)
          </label>
          <input
            type="number"
            min={1}
            max={9}
            value={form.batting_order ?? ''}
            onChange={e => {
              const v = parseInt(e.target.value, 10);
              onField('batting_order', isNaN(v) ? null : Math.max(1, Math.min(9, v)));
            }}
            placeholder="1"
            className="w-24 bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      )}

      {submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}
    </div>
  );
}

// Export valid batter positions for external use
export { BATTER_POSITIONS };
