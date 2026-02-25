import { useState, useEffect, useMemo } from 'react';
import type {
  BattingStatRow,
  PitchingStatRow,
  StatsTab,
  BattingSortKey,
  PitchingSortKey,
  SortDirection,
} from '../types/stats';

const BATTING_DEFAULT_SORT: BattingSortKey = 'battingAverage';
const PITCHING_DEFAULT_SORT: PitchingSortKey = 'runsAllowed';

const BATTING_DEFAULT_DIR: Record<BattingSortKey, SortDirection> = {
  playerName:     'asc',
  teamName:       'asc',
  gamesPlayed:    'desc',
  atBats:         'desc',
  hits:           'desc',
  homeRuns:       'desc',
  rbi:            'desc',
  walks:          'desc',
  strikeouts:     'desc',
  battingAverage: 'desc',
};

const PITCHING_DEFAULT_DIR: Record<PitchingSortKey, SortDirection> = {
  playerName:       'asc',
  teamName:         'asc',
  gamesPlayed:      'desc',
  outsRecorded:     'desc',
  runsAllowed:      'asc',
  strikeoutsPitched:'desc',
};

interface UseStatsPageReturn {
  activeTab: StatsTab;
  setActiveTab: (tab: StatsTab) => void;
  battingRows: BattingStatRow[];
  pitchingRows: PitchingStatRow[];
  battingSortKey: BattingSortKey;
  pitchingSortKey: PitchingSortKey;
  sortDirection: SortDirection;
  onBattingSort: (key: BattingSortKey) => void;
  onPitchingSort: (key: PitchingSortKey) => void;
  isLoading: boolean;
  error: string | null;
}

export function useStatsPage(): UseStatsPageReturn {
  const [activeTab, setActiveTabState] = useState<StatsTab>('batting');
  const [rawBatting, setRawBatting] = useState<BattingStatRow[]>([]);
  const [rawPitching, setRawPitching] = useState<PitchingStatRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [battingSortKey, setBattingSortKey] = useState<BattingSortKey>(BATTING_DEFAULT_SORT);
  const [battingSortDir, setBattingSortDir] = useState<SortDirection>('desc');
  const [pitchingSortKey, setPitchingSortKey] = useState<PitchingSortKey>(PITCHING_DEFAULT_SORT);
  const [pitchingSortDir, setPitchingSortDir] = useState<SortDirection>('asc');

  useEffect(() => {
    Promise.all([
      fetch('/api/stats/batting').then(r => r.json()),
      fetch('/api/stats/pitching').then(r => r.json()),
    ])
      .then(([batting, pitching]: [BattingStatRow[], PitchingStatRow[]]) => {
        setRawBatting(batting);
        setRawPitching(pitching);
      })
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setIsLoading(false));
  }, []);

  function setActiveTab(tab: StatsTab): void {
    setActiveTabState(tab);
    // Reset sort to tab default
    if (tab === 'batting') {
      setBattingSortKey(BATTING_DEFAULT_SORT);
      setBattingSortDir('desc');
    } else {
      setPitchingSortKey(PITCHING_DEFAULT_SORT);
      setPitchingSortDir('asc');
    }
  }

  function onBattingSort(key: BattingSortKey): void {
    if (key === battingSortKey) {
      setBattingSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setBattingSortKey(key);
      setBattingSortDir(BATTING_DEFAULT_DIR[key]);
    }
  }

  function onPitchingSort(key: PitchingSortKey): void {
    if (key === pitchingSortKey) {
      setPitchingSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setPitchingSortKey(key);
      setPitchingSortDir(PITCHING_DEFAULT_DIR[key]);
    }
  }

  const battingRows = useMemo(() => {
    return [...rawBatting].sort((a, b) => {
      const valA = a[battingSortKey] ?? -Infinity;
      const valB = b[battingSortKey] ?? -Infinity;
      if (valA < valB) return battingSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return battingSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawBatting, battingSortKey, battingSortDir]);

  const pitchingRows = useMemo(() => {
    return [...rawPitching].sort((a, b) => {
      const valA = a[pitchingSortKey];
      const valB = b[pitchingSortKey];
      if (valA < valB) return pitchingSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return pitchingSortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawPitching, pitchingSortKey, pitchingSortDir]);

  const sortDirection = activeTab === 'batting' ? battingSortDir : pitchingSortDir;

  return {
    activeTab,
    setActiveTab,
    battingRows,
    pitchingRows,
    battingSortKey,
    pitchingSortKey,
    sortDirection,
    onBattingSort,
    onPitchingSort,
    isLoading,
    error,
  };
}
