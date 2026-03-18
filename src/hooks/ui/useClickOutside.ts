import { useEffect, useRef } from "react";

export function useClickOutside<T extends Element>(
  ref: React.RefObject<T | null>,
  onClickOutside: () => void,
  enabled: boolean,
) {
  const callbackRef = useRef(onClickOutside);
  callbackRef.current = onClickOutside;

  useEffect(() => {
    if (!enabled) return;
    function handleMouseDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        callbackRef.current();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, enabled]);
}
