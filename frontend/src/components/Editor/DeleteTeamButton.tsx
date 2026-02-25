interface DeleteTeamButtonProps {
  onDelete: () => void;
}

export function DeleteTeamButton({ onDelete }: DeleteTeamButtonProps) {
  return (
    <button
      onClick={onDelete}
      className="min-h-[44px] px-4 py-2 border border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300 rounded text-sm font-medium transition-colors cursor-pointer"
    >
      Delete Team
    </button>
  );
}
