const itemBase =
  "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors";
const controlButtonBase = "text-xs font-semibold cursor-pointer";

export const pickerStyles = {
  base: "w-64 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white",
  searchRow:
    "flex items-center gap-2 mx-3 mt-2.5 mb-1 px-2.5 py-1.5 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-colors",
  searchIcon: "text-gray-400 shrink-0",
  searchInput:
    "text-sm outline-none w-full text-gray-700 placeholder:text-gray-400",
  controlRow:
    "flex items-center justify-end gap-2 px-3 py-1.5 border-b border-gray-100",
  controlSelectAll: `${controlButtonBase} text-blue-500 hover:text-blue-700`,
  controlClear: `${controlButtonBase} text-red-400 hover:text-red-600`,
  checkbox: "w-4 h-4 shrink-0 cursor-pointer accent-[var(--accent)]",
  optionList: "max-h-48 overflow-y-auto",
  optionItem: `${itemBase} hover:bg-gray-50`,
  optionLabel: "text-sm text-gray-700",
  optionEmpty: "px-3 py-4 text-sm text-gray-400 text-center",
};
