export const tableStyles = {
  wrapper: "flex-1 min-h-0 overflow-auto border border-gray-200 rounded-lg",
  table: "text-sm border-collapse w-full table-fixed",

  // Header
  headerRow: "border-b border-gray-200",
  headerIndexCell:
    "px-1 py-1.5 text-xs text-center select-none w-9 whitespace-nowrap sticky top-0 bg-gray-100 text-gray-400 z-10",
  headerCell:
    "px-3 py-1.5 text-gray-600 font-medium whitespace-nowrap sticky top-0 bg-gray-100 z-10 border-b border-gray-200",
  headerCellInteractive:
    "px-3 py-1.5 text-gray-600 font-medium whitespace-nowrap sticky top-0 bg-gray-100 z-10 border-b border-gray-200 cursor-pointer select-none hover:bg-gray-200 transition-colors relative",
  headerCellAccent:
    "px-3 py-1.5 font-medium whitespace-nowrap sticky top-0 bg-accent text-white z-10 border-b border-accent cursor-pointer transition-colors",

  // Body
  row: "border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors",
  rowStatic: "border-b border-gray-100",
  indexCell:
    "px-2 py-1.5 text-xs text-right select-none w-8 whitespace-nowrap text-gray-300",
  cell: "px-3 py-1.5 text-gray-700 whitespace-nowrap",
  cellEmpty: "px-3 py-1.5 text-gray-200 whitespace-nowrap",
};
