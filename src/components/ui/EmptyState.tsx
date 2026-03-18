import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  children: ReactNode;
  centered?: boolean;
}

export function EmptyState({ title, children, centered = false }: EmptyStateProps) {
  if (centered) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {title && <p className="text-sm text-gray-400">{title}</p>}
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      {title && <p className="text-sm text-gray-400">{title}</p>}
      {children}
    </div>
  );
}
