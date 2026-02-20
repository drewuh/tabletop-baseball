import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Team } from '../types/team';

interface UseTeamSelectReturn {
  teams: Team[];
  selectedTeamId: string | null;
  cpuTeamId: string | null;
  isLoading: boolean;
  error: string | null;
  selectTeam: (id: string) => void;
  confirmSelection: () => Promise<void>;
  isConfirming: boolean;
}

export function useTeamSelect(): UseTeamSelectReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then((data: Team[]) => {
        setTeams(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load teams.');
        setIsLoading(false);
      });
  }, []);

  const cpuTeamId = teams.find(t => t.id !== selectedTeamId)?.id ?? null;

  function selectTeam(id: string): void {
    setSelectedTeamId(id);
  }

  async function confirmSelection(): Promise<void> {
    if (!selectedTeamId || !cpuTeamId) return;
    setIsConfirming(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerTeamId: selectedTeamId, cpuTeamId }),
      });
      const data = (await res.json()) as { gameId: string };
      navigate(`/game/${data.gameId}`);
    } catch {
      setError('Failed to start game.');
      setIsConfirming(false);
    }
  }

  return {
    teams,
    selectedTeamId,
    cpuTeamId,
    isLoading,
    error,
    selectTeam,
    confirmSelection,
    isConfirming,
  };
}
