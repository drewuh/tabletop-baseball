import type { TeamEditorData } from '../../types/editor';
import { TeamListRow } from './TeamListRow';
import { TeamListEmptyState } from './TeamListEmptyState';

interface TeamListProps {
  teams: TeamEditorData[];
}

export function TeamList({ teams }: TeamListProps) {
  if (teams.length === 0) return <TeamListEmptyState />;

  return (
    <div className="flex flex-col gap-2">
      {teams.map(team => (
        <TeamListRow key={team.id} team={team} />
      ))}
    </div>
  );
}
