import { useState, useEffect } from 'react';
import type { TeamEditorData, PlayerEditorData } from '../types/editor';

export function useTeamEditorDetail(teamId: string) {
  const [team, setTeam] = useState<TeamEditorData | null>(null);
  const [players, setPlayers] = useState<PlayerEditorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/teams/${teamId}`).then(r => r.json()),
      fetch(`/api/teams/${teamId}/players`).then(r => r.json()),
    ])
      .then(([teamData, playersData]: [TeamEditorData, PlayerEditorData[]]) => {
        setTeam(teamData);
        setPlayers(playersData);
      })
      .catch(() => setError('Failed to load team.'))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [teamId]);

  return { team, players, isLoading, error, reload: load };
}
