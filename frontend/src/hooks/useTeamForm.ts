import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TeamEditorData } from '../types/editor';

interface TeamFormState {
  city: string;
  name: string;
  abbreviation: string;
  primary_color: string;
  secondary_color: string;
}

interface UseTeamFormOptions {
  initialValues?: Partial<TeamFormState>;
  teamId?: string;
}

function isValidHex(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export function useTeamForm({ initialValues = {}, teamId }: UseTeamFormOptions) {
  const navigate = useNavigate();

  const [form, setForm] = useState<TeamFormState>({
    city: initialValues.city ?? '',
    name: initialValues.name ?? '',
    abbreviation: initialValues.abbreviation ?? '',
    primary_color: initialValues.primary_color ?? '#3f3f46',
    secondary_color: initialValues.secondary_color ?? '#a1a1aa',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setField<K extends keyof TeamFormState>(key: K, value: TeamFormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    if (!form.city.trim()) return 'City is required.';
    if (!form.name.trim()) return 'Team name is required.';
    if (form.abbreviation.replace(/[^a-zA-Z]/g, '').length !== 3) return 'Abbreviation must be exactly 3 letters.';
    if (!isValidHex(form.primary_color)) return 'Primary color must be a valid hex value (e.g. #1a2b3c).';
    if (!isValidHex(form.secondary_color)) return 'Secondary color must be a valid hex value.';
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) { setSubmitError(err); return; }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const url = teamId ? `/api/teams/${teamId}` : '/api/teams';
      const method = teamId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          abbreviation: form.abbreviation.toUpperCase(),
        }),
      });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setSubmitError(body.error ?? 'Failed to save team.');
        return;
      }
      const saved = await res.json() as TeamEditorData;
      navigate(`/editor/teams/${saved.id}`);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, setField, isSubmitting, submitError, submit };
}
