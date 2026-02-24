interface GenerateRosterButtonProps {
  onGenerate: () => void;
  isLoading: boolean;
}

export function GenerateRosterButton({ onGenerate, isLoading }: GenerateRosterButtonProps) {
  return (
    <button
      onClick={onGenerate}
      disabled={isLoading}
      className="min-h-[44px] px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-medium rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          Generating…
        </>
      ) : (
        '✨ Generate Roster'
      )}
    </button>
  );
}
