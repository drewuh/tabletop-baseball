import { useStatsPage } from '../hooks/useStatsPage';
import { StatsTabBar } from '../components/Stats/StatsTabBar';
import { StatsTable } from '../components/Stats/StatsTable';

export default function StatsPage() {
  const {
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
  } = useStatsPage();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading stats…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-zinc-100 mb-6">Season Statistics</h1>
      <div className="flex flex-col gap-4">
        <StatsTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        <StatsTable
          mode={activeTab}
          battingRows={battingRows}
          pitchingRows={pitchingRows}
          battingSortKey={battingSortKey}
          pitchingSortKey={pitchingSortKey}
          sortDirection={sortDirection}
          onBattingSort={onBattingSort}
          onPitchingSort={onPitchingSort}
        />
      </div>
    </div>
  );
}
