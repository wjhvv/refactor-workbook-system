import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

// Uncontrolled: instant mount/unmount (existing usage, no animation)
// Controlled (isOpen prop): fade + scale enter/exit animation
export function DialogOverlay({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen?: boolean;
}) {
  if (isOpen === undefined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        {children}
      </div>
    );
  }
  return <AnimatedOverlay isOpen={isOpen}>{children}</AnimatedOverlay>;
}

function AnimatedOverlay({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(isOpen);
  const [show, setShow] = useState(false);

  // Freeze content during exit animation so stale-data flicker doesn't show.
  // Use isOpen (not show) because show is a delayed state — in the render where
  // isOpen flips to false, show is still true and would overwrite with stale content.
  const frozenChildren = useRef(children);
  if (isOpen) frozenChildren.current = children;

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-[background-color,opacity] duration-150 ${
        show ? "bg-black/30 opacity-100" : "bg-black/0 opacity-0"
      }`}
    >
      <div
        className={`transition-all duration-150 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {frozenChildren.current}
      </div>
    </div>
  );
}
