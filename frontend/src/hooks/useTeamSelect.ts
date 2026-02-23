import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Team } from '../types/team';

export type SelectStep = 1 | 2;

interface UseTeamSelectReturn {
  teams: Team[];
  step: SelectStep;
  playerTeamId: string | null;
  cpuTeamId: string | null;
  isLoading: boolean;
  error: string | null;
  isConfirming: boolean;
  selectPlayerTeam: (id: string) => void;
  selectCpuTeam: (id: string) => void;
  goBack: () => void;
  confirmSelection: () => Promise<void>;
}

export function useTeamSelect(): UseTeamSelectReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [step, setStep] = useState<SelectStep>(1);
  const [playerTeamId, setPlayerTeamId] = useState<string | null>(null);
  const [cpuTeamId, setCpuTeamId] = useState<string | null>(null);
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

  function selectPlayerTeam(id: string): void {
    setPlayerTeamId(id);
    setCpuTeamId(null);
    setStep(2);
  }

  function selectCpuTeam(id: string): void {
    setCpuTeamId(id);
  }

  function goBack(): void {
    setStep(1);
    setPlayerTeamId(null);
    setCpuTeamId(null);
  }

  async function confirmSelection(): Promise<void> {
    if (!playerTeamId || !cpuTeamId) return;
    setIsConfirming(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerTeamId, cpuTeamId }),
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
    step,
    playerTeamId,
    cpuTeamId,
    isLoading,
    error,
    isConfirming,
    selectPlayerTeam,
    selectCpuTeam,
    goBack,
    confirmSelection,
  };
}
