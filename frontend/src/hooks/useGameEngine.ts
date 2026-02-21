import { useState, useEffect, useCallback } from 'react';
import type { GameState, AtBatResult, RollResult, PlayResult } from '../types/game';

interface UseGameEngineReturn {
  gameState: GameState | null;
  rollResult: RollResult | null;
  playResult: PlayResult | null;
  isLoading: boolean;
  isRolling: boolean;
  error: string | null;
  rollDice: () => Promise<void>;
}

export function useGameEngine(gameId: string): UseGameEngineReturn {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [playResult, setPlayResult] = useState<PlayResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadState(): Promise<void> {
    const res = await fetch(`/api/games/${gameId}/state`);
    const data = (await res.json()) as GameState;
    setGameState(data);
  }

  useEffect(() => {
    loadState()
      .catch(() => setError('Failed to load game state.'))
      .finally(() => setIsLoading(false));
  }, [gameId]);

  const isPlayerTurn = useCallback((): boolean => {
    if (!gameState) return false;
    const playerIsHome = gameState.homeTeam.id === gameState.homeTeam.id; // always home
    return playerIsHome ? !gameState.isTopInning : gameState.isTopInning;
  }, [gameState]);

  const rollDice = useCallback(async (): Promise<void> => {
    if (!gameState || isRolling) return;
    setIsRolling(true);
    setRollResult(null);
    setPlayResult(null);

    try {
      // Brief delay so the "rolling" state is visible
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await fetch(`/api/games/${gameId}/atbat`, { method: 'POST' });
      const data = (await res.json()) as AtBatResult;

      setRollResult(data.roll);
      setPlayResult(data.play);

      // Refresh full game state after the play
      await loadState();
    } catch {
      setError('Failed to resolve at-bat.');
    } finally {
      setIsRolling(false);
    }
  }, [gameId, gameState, isRolling]);

  // Auto-advance CPU turns
  useEffect(() => {
    if (!gameState || gameState.phase !== 'active' || isRolling) return;
    if (!isPlayerTurn()) {
      const timer = setTimeout(() => {
        rollDice();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [gameState, isRolling, isPlayerTurn, rollDice]);

  return {
    gameState,
    rollResult,
    playResult,
    isLoading,
    isRolling,
    error,
    rollDice,
  };
}
