interface AbbreviationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function AbbreviationField({ value, onChange }: AbbreviationFieldProps) {
  const letters = value.replace(/[^a-zA-Z]/g, '');
  const isValid = letters.length === 3;

  function handleChange(raw: string) {
    // Allow only letters, enforce uppercase, cap at 3
    const cleaned = raw.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
    onChange(cleaned);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
        Abbreviation
      </label>
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="ABC"
        maxLength={3}
        className={`w-24 bg-zinc-800 border rounded px-3 py-2 text-sm font-mono font-bold text-zinc-100 uppercase tracking-widest outline-none focus:ring-1 ${
          isValid
            ? 'border-zinc-600 focus:ring-amber-400'
            : value.length > 0 ? 'border-red-700 focus:ring-red-500' : 'border-zinc-600 focus:ring-amber-400'
        }`}
      />
      {value.length > 0 && !isValid && (
        <p className="text-red-400 text-xs">Must be exactly 3 letters.</p>
      )}
    </div>
  );
}
