import { teamThemes, fallbackTheme } from '../../lib/teamThemes';

interface ConfirmTeamButtonProps {
  disabled: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
  selectedTeamId: string | null;
}

export function ConfirmTeamButton({
  disabled,
  isConfirming,
  onConfirm,
  selectedTeamId,
}: ConfirmTeamButtonProps) {
  const theme = selectedTeamId ? (teamThemes[selectedTeamId] ?? fallbackTheme) : fallbackTheme;

  if (disabled || isConfirming) {
    return (
      <button
        onClick={onConfirm}
        disabled
        className="w-64 py-3 rounded font-bold text-sm tracking-widest uppercase bg-zinc-700 text-zinc-500 cursor-not-allowed"
      >
        {isConfirming ? 'Starting\u2026' : 'Confirm Selection'}
      </button>
    );
  }

  return (
    <button
      onClick={onConfirm}
      className="w-64 py-3 rounded font-bold text-sm tracking-widest uppercase cursor-pointer active:scale-95 transition-transform"
      style={{ backgroundColor: theme.primaryHex, color: '#f4f4f5' }}
    >
      Confirm Selection
    </button>
  );
}
