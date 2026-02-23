interface RollDiceButtonProps {
  onRoll: () => void;
  isRolling: boolean;
  isPlayerTurn: boolean;
}

export function RollDiceButton({ onRoll, isRolling, isPlayerTurn }: RollDiceButtonProps) {
  const disabled = isRolling || !isPlayerTurn;

  return (
    <button
      onClick={onRoll}
      disabled={disabled}
      className={`w-full py-3 rounded font-bold text-sm tracking-widest uppercase transition-all ${
        isRolling
          ? 'bg-amber-700 text-zinc-400 cursor-wait'
          : !isPlayerTurn
          ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 cursor-pointer'
      }`}
    >
      {isRolling ? 'Rolling…' : !isPlayerTurn ? 'CPU Rolling…' : 'Roll Dice'}
    </button>
  );
}
