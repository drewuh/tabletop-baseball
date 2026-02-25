import { useState, useEffect } from 'react';
import type { TeamEditorData } from '../types/editor';

export function useEditorTeams() {
  const [teams, setTeams] = useState<TeamEditorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    setError(null);
    fetch('/api/teams')
      .then(r => r.json())
      .then((data: TeamEditorData[]) => setTeams(data))
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  return { teams, isLoading, error, reload: load };
}
