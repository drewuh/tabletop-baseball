import { ColorPickerField } from './ColorPickerField';
import { AbbreviationField } from './AbbreviationField';

interface TeamFormState {
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
}

interface TeamFormProps {
  form: TeamFormState;
  onField: <K extends keyof TeamFormState>(key: K, value: TeamFormState[K]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  submitLabel: string;
}

export function TeamForm({ form, onField, onSubmit, isSubmitting, submitError, submitLabel }: TeamFormProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">City</label>
        <input
          type="text"
          value={form.city}
          onChange={e => onField('city', e.target.value)}
          placeholder="Springfield"
          className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* Team name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Team Name</label>
        <input
          type="text"
          value={form.name}
          onChange={e => onField('name', e.target.value)}
          placeholder="Thunderbolts"
          className="bg-zinc-800 border border-zinc-600 rounded px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-1 focus:ring-amber-400"
        />
      </div>

      {/* Abbreviation */}
      <AbbreviationField value={form.abbreviation} onChange={v => onField('abbreviation', v)} />

      {/* Colors */}
      <ColorPickerField
        label="Primary Color"
        value={form.primary_color}
        onChange={v => onField('primary_color', v)}
      />
      <ColorPickerField
        label="Secondary Color"
        value={form.secondary_color}
        onChange={v => onField('secondary_color', v)}
      />

      {/* Error */}
      {submitError && (
        <p className="text-red-400 text-sm">{submitError}</p>
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="self-start min-h-[44px] px-6 py-2.5 bg-amber-500 text-zinc-950 font-bold text-sm rounded hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}
