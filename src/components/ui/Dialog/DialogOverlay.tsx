import type { ReactNode } from "react";

export function DialogOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      {children}
    </div>
  );
}
