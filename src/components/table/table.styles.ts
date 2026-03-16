export const tableStyles = {
  // RawSheetView
  rawWrapper: "flex-1 min-h-0 overflow-auto border border-gray-200 rounded-lg",
  rawTable: "text-sm border-collapse table-fixed",
  rawRow:
    "border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors",
  rawRowSelected: "border-b border-gray-200",
  rawRowIndexSelected:
    "px-1 py-1.5 text-xs text-center select-none w-9 whitespace-nowrap sticky top-0 bg-gray-100 text-gray-400 z-10",
  rawCell: "px-3 py-1.5 text-gray-700 whitespace-nowrap",
  rawCellEmpty: "px-3 py-1.5 text-gray-200 whitespace-nowrap",
  rawCellSelected:
    "px-3 py-1.5 text-gray-600 font-medium whitespace-nowrap sticky top-0 bg-gray-100 z-10 border-b border-gray-200",
  rawCellSelectedInteractive:
    "px-3 py-1.5 text-gray-600 font-medium whitespace-nowrap sticky top-0 bg-gray-100 z-10 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors",
  rawCellSplitSelected:
    "px-3 py-1.5 font-medium whitespace-nowrap sticky top-0 bg-violet-100 text-violet-700 z-10 border-b border-violet-300 cursor-pointer hover:bg-violet-200 transition-colors",

  // Table
  wrapper: "overflow-auto border border-gray-200 rounded-lg",
  table: "text-sm border-collapse w-full",
  thead: "bg-gray-50 border-b border-gray-200",
  th: "px-3 py-2 text-left text-xs font-semibold text-gray-500 whitespace-nowrap",
  tr: "border-b border-gray-100 hover:bg-gray-50 transition-colors",
  td: "px-3 py-2 text-gray-700 whitespace-nowrap",
  tdEmpty: "px-3 py-2 text-gray-300 whitespace-nowrap",
};
