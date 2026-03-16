export const panelStyles = {
  container: "flex items-center gap-4 text-sm flex-wrap",
  label: "text-xs text-gray-400",
  toggleGroup: "flex rounded-lg border border-gray-200 overflow-hidden text-xs",
  toggleBtn: (active: boolean, divider = false) =>
    `px-3 py-1.5 cursor-pointer transition-colors ${divider ? "border-l border-gray-200 " : ""}${
      active
        ? "bg-blue-100 text-blue-600 font-medium"
        : "text-gray-500 hover:bg-gray-50"
    }`,
};
