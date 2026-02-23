import { useState, useCallback } from 'react';
import type { GameLogEntry } from '../types/game';

interface UseGameLogReturn {
  entries: GameLogEntry[];
  setEntries: (entries: GameLogEntry[]) => void;
  addEntry: (entry: GameLogEntry) => void;
}

export function useGameLog(initial: GameLogEntry[] = []): UseGameLogReturn {
  const [entries, setEntries] = useState<GameLogEntry[]>(initial);

  const addEntry = useCallback((entry: GameLogEntry) => {
    setEntries(prev => [...prev, entry]);
  }, []);

  return { entries, setEntries, addEntry };
}
