import { useState, useCallback } from "react";

export function useDeleteConfirm<T>() {
  const [pending, setPending] = useState<T | null>(null);
  const open = useCallback((item: T) => setPending(item), []);
  const close = useCallback(() => setPending(null), []);
  return { pending, isOpen: pending !== null, open, close };
}
