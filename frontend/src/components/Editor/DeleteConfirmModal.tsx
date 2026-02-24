interface DeleteConfirmModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  error: string | null;
  entityLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({
  isOpen, isDeleting, error, entityLabel, onConfirm, onClose,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full">
          <h2 className="text-zinc-100 font-bold text-lg mb-2">Delete {entityLabel}?</h2>
          <p className="text-zinc-400 text-sm mb-6">
            This action cannot be undone. All associated data will be permanently removed.
          </p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="min-h-[44px] px-5 py-2 border border-zinc-600 text-zinc-300 hover:text-zinc-100 rounded font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="min-h-[44px] px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-bold text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
