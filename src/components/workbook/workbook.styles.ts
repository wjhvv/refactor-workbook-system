const baseWorkbookTabClass =
  "shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 cursor-pointer select-none transition-colors active:scale-[0.97]";

export const workbookTabStyles = {
  base: baseWorkbookTabClass,
  active: `${baseWorkbookTabClass} border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-bg)]`,
  inactive: `${baseWorkbookTabClass} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`,
};

const baseSheetTabClass =
  "shrink-0 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer transition-colors active:scale-[0.97]";

export const sheetTabStyles = {
  base: baseSheetTabClass,
  active: `${baseSheetTabClass} border-[var(--accent)] text-[var(--accent)]`,
  inactive: `${baseSheetTabClass} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`,
};
