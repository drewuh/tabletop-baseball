import type { StatsTab } from '../../types/stats';

interface StatsTabBarProps {
  activeTab: StatsTab;
  onTabChange: (tab: StatsTab) => void;
}

export function StatsTabBar({ activeTab, onTabChange }: StatsTabBarProps) {
  return (
    <div className="flex gap-2">
      {(['batting', 'pitching'] as StatsTab[]).map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer capitalize ${
            activeTab === tab
              ? 'bg-zinc-700 text-zinc-100'
              : 'bg-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab === 'batting' ? 'Batting Leaders' : 'Pitching Leaders'}
        </button>
      ))}
    </div>
  );
}
