import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  children: ReactNode;
}

export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl">
      {title && <p className="text-sm text-gray-400">{title}</p>}
      {children}
    </div>
  );
}
