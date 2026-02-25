import { useState } from 'react';

export function useDeleteConfirm(onConfirm: () => Promise<void>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function open() { setIsOpen(true); setError(null); }
  function close() { setIsOpen(false); setError(null); }

  async function confirm() {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setIsDeleting(false);
    }
  }

  return { isOpen, isDeleting, error, open, close, confirm };
}
