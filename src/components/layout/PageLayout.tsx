import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description?: string | string[];
  icon?: LucideIcon;
  children: ReactNode;
}

export function PageLayout({
  title,
  description,
  icon: Icon,
  children,
}: PageLayoutProps) {
  const descItems = Array.isArray(description)
    ? description
    : description
      ? [description]
      : [];

  return (
    <div className="flex flex-col flex-1 min-h-0 mx-auto w-full max-w-4xl px-8">
      <div className="pt-8 pb-5">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon size={20} className="text-accent" />}
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        </div>
        {descItems.length > 0 && (
          <ul className="ml-1 list-disc list-inside flex flex-col gap-1">
            {descItems.map((item) => (
              <li key={item} className="text-sm text-gray-500">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col flex-1 min-h-0 pb-8">{children}</div>
    </div>
  );
}
