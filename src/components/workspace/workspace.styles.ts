export const workspacePickerStyles = {
  trigger:
    "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-accent hover:text-accent transition-colors cursor-pointer",
  triggerLabel: "max-w-48 truncate",
  panel:
    "absolute right-0 top-full mt-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden",
  search: "p-2 border-b border-gray-100",
  list: "max-h-60 overflow-y-auto",
  empty: "text-sm text-gray-400 text-center py-5",
  footer: "border-t border-gray-100 p-2",
  footerBtn:
    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-accent transition-colors cursor-pointer",
};

export const workspaceItemStyles = {
  row: (isActive: boolean) =>
    `group flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${
      isActive ? "bg-accent-light" : "hover:bg-gray-50"
    }`,
  dot: (isActive: boolean) =>
    `w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-accent" : "bg-gray-200"}`,
  nameInput:
    "w-full text-sm font-medium border border-accent rounded px-1 outline-none",
  name: "text-sm font-medium text-gray-700 truncate",
  meta: "text-xs text-gray-400",
  actions: (visible: boolean) =>
    `flex items-center gap-1.5 shrink-0 transition-opacity ${
      visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
    }`,
};
