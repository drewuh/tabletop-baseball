import { Link } from 'react-router-dom';
import { useEditorTeams } from '../hooks/useEditorTeams';
import { TeamList } from '../components/Editor/TeamList';

export default function EditorPage() {
  const { teams, isLoading, error } = useEditorTeams();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        Loading teams…
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
    <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Team Editor</h1>
        <Link
          to="/editor/teams/new"
          className="min-h-[44px] px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold text-sm rounded hover:bg-amber-400 transition-colors flex items-center"
        >
          + New Team
        </Link>
      </div>
      <TeamList teams={teams} />
    </div>
  );
}
