const baseTabClass =
  "shrink-0 flex items-center justify-between gap-3 pl-4 pr-4 py-2.5 text-sm font-medium border-b-2 cursor-pointer select-none whitespace-nowrap transition-colors active:scale-[0.97] min-w-25";

export const tabStyles = {
  base: baseTabClass,
  active: `${baseTabClass} border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-bg)]`,
  inactive: `${baseTabClass} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`,
};
