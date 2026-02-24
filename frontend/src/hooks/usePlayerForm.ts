import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CardGrid } from '../types/editor';
import { emptyCardGrid } from '../types/editor';

interface PlayerFormState {
  name: string;
  position: string;
  batting_order: number | null;
  is_pitcher: boolean;
  card: CardGrid;
}

interface UsePlayerFormOptions {
  teamId: string;
  playerId?: string;        // present when editing
}

export function usePlayerForm({ teamId, playerId }: UsePlayerFormOptions) {
  const navigate = useNavigate();

  const [form, setForm] = useState<PlayerFormState>({
    name: '',
    position: 'C',
    batting_order: null,
    is_pitcher: false,
    card: emptyCardGrid(),
  });
  const [isLoading, setIsLoading] = useState(!!playerId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load existing player when editing
  useEffect(() => {
    if (!playerId) return;
    setIsLoading(true);
    fetch(`/api/players/${playerId}`)
      .then(r => r.json())
      .then((data: PlayerFormState & { card: CardGrid }) => {
        setForm({
          name: data.name,
          position: data.position,
          batting_order: data.batting_order,
          is_pitcher: Boolean(data.is_pitcher),
          card: data.card ?? emptyCardGrid(),
        });
      })
      .catch(() => setSubmitError('Failed to load player.'))
      .finally(() => setIsLoading(false));
  }, [playerId]);

  function setField<K extends keyof PlayerFormState>(key: K, value: PlayerFormState[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function setCard(card: CardGrid) {
    setForm(f => ({ ...f, card }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'Player name is required.';
    if (!form.position) return 'Position is required.';
    if (form.card.length !== 36) return 'Card must have exactly 36 cells.';
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) { setSubmitError(err); return; }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (playerId) {
        // Update existing player
        const res = await fetch(`/api/players/${playerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.name, position: form.position, batting_order: form.batting_order, card: form.card }),
        });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          setSubmitError(body.error ?? 'Failed to save player.'); return;
        }
      } else {
        // Create new player — generate ID from team abbreviation
        const teamRes = await fetch(`/api/teams/${teamId}`);
        const teamData = await teamRes.json() as { abbreviation: string };
        const abbr = teamData.abbreviation.toLowerCase();
        const ts = Date.now();
        const newId = form.is_pitcher ? `${abbr}-p-${ts}` : `${abbr}-b-${ts}`;
        const res = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newId,
            team_id: teamId,
            name: form.name,
            position: form.position,
            batting_order: form.batting_order,
            is_pitcher: form.is_pitcher,
            card: form.card,
          }),
        });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          setSubmitError(body.error ?? 'Failed to create player.'); return;
        }
      }
      navigate(`/editor/teams/${teamId}`);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return { form, setField, setCard, isLoading, isSubmitting, submitError, submit };
}
