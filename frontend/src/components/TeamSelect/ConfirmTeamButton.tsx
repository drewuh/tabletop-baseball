interface ConfirmTeamButtonProps {
  disabled: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
}

export function ConfirmTeamButton({ disabled, isConfirming, onConfirm }: ConfirmTeamButtonProps) {
  return (
    <button
      onClick={onConfirm}
      disabled={disabled || isConfirming}
      className={`w-64 py-3 rounded font-bold text-sm tracking-widest uppercase transition-all ${
        disabled || isConfirming
          ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 cursor-pointer'
      }`}
    >
      {isConfirming ? 'Starting…' : 'Confirm Selection'}
    </button>
  );
}
