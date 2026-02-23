import { useState, useEffect } from 'react';
import type { PlayerCardData } from '../types/playerCard';

interface UsePlayerCardsParams {
  batterId: string;
  pitcherId: string;
}

interface UsePlayerCardsReturn {
  batterCard: PlayerCardData | null;
  pitcherCard: PlayerCardData | null;
  isLoading: boolean;
}

export function usePlayerCards({
  batterId,
  pitcherId,
}: UsePlayerCardsParams): UsePlayerCardsReturn {
  const [batterCard, setBatterCard] = useState<PlayerCardData | null>(null);
  const [pitcherCard, setPitcherCard] = useState<PlayerCardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!batterId || !pitcherId) return;

    setIsLoading(true);

    const fetchBatter = fetch(`/api/players/${batterId}/card`).then(
      r => r.json() as Promise<PlayerCardData>,
    );
    const fetchPitcher = fetch(`/api/players/${pitcherId}/card`).then(
      r => r.json() as Promise<PlayerCardData>,
    );

    Promise.all([fetchBatter, fetchPitcher])
      .then(([batter, pitcher]) => {
        setBatterCard(batter);
        setPitcherCard(pitcher);
      })
      .catch(() => {
        setBatterCard(null);
        setPitcherCard(null);
      })
      .finally(() => setIsLoading(false));
  }, [batterId, pitcherId]);

  return { batterCard, pitcherCard, isLoading };
}
