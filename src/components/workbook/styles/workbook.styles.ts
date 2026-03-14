const baseWorkbookTabClass =
  'shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 cursor-pointer select-none transition-colors active:scale-[0.97]'

export const workbookTabStyles = {
  active: `${baseWorkbookTabClass} border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-bg)]`,
  inactive: `${baseWorkbookTabClass} border-transparent text-gray-500 hover:text-[#0087dc] hover:border-[#0087dc]/40`,
}

const baseSheetTabClass =
  'shrink-0 px-4 py-2.5 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors active:scale-[0.97] border-b-2'

export const sheetTabStyles = {
  active: `${baseSheetTabClass} border-[var(--accent)] text-[var(--accent)]`,
  inactive: `${baseSheetTabClass} border-gray-200 text-gray-500 hover:text-[#0087dc]`,
}
