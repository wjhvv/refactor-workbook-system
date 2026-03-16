export const dropdownStyles = {
  container:
    "z-50 bg-white border border-gray-200 rounded-xl shadow-lg pt-6 pb-1 min-w-32 text-sm",
  item: (active: boolean, danger: boolean) =>
    [
      "w-full flex items-center gap-2.5 px-3 py-1.5 cursor-pointer transition-colors text-left",
      danger ? "text-gray-400 hover:bg-red-50 hover:text-red-500" : "text-gray-700 hover:bg-gray-50",
      active ? "bg-gray-100" : "",
    ].join(" "),
  itemLeading: "w-4 h-4 flex items-center justify-center shrink-0",
  divider: "border-t border-gray-100 mt-1",
};
