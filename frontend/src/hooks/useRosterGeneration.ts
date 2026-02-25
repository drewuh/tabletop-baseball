import { useState } from 'react';
import type { RosterGenerationResult, GeneratedPlayer } from '../types/editor';

export function useRosterGeneration(teamId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRoster, setGeneratedRoster] = useState<GeneratedPlayer[] | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setIsLoading(true);
    setError(null);
    setGeneratedRoster(null);
    try {
      // Simulated delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 1800));
      const res = await fetch(`/api/teams/${teamId}/generate-roster`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setError(body.error ?? 'Generation failed.');
        return;
      }
      const data = await res.json() as RosterGenerationResult;
      setGeneratedRoster(data.players);
      setIsSimulated(data.isSimulated);
    } catch {
      setError('Network error during generation.');
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setGeneratedRoster(null);
    setIsSimulated(false);
    setError(null);
  }

  return { generate, isLoading, generatedRoster, isSimulated, error, reset };
}
