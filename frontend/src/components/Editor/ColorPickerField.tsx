interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  const isValid = /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {/* Color swatch */}
        <div
          className="w-10 h-10 rounded border border-zinc-600 shrink-0"
          style={{ backgroundColor: isValid ? value : '#3f3f46' }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#1a2b3c"
          maxLength={7}
          className={`flex-1 bg-zinc-800 border rounded px-3 py-2 text-sm font-mono text-zinc-100 outline-none focus:ring-1 ${
            isValid
              ? 'border-zinc-600 focus:ring-amber-400'
              : 'border-red-700 focus:ring-red-500'
          }`}
        />
      </div>
      {!isValid && value.length > 0 && (
        <p className="text-red-400 text-xs">Must be a 6-digit hex value (e.g. #1a2b3c)</p>
      )}
    </div>
  );
}
