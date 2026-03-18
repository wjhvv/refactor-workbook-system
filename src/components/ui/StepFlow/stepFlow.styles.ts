export const stepStyles = {
  circle: "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
  circleActive: "bg-accent text-white ring-4 ring-accent/20",
  circleCompleted: "bg-accent text-white hover:bg-accent-dark",
  circleLocked: "bg-gray-100 text-gray-400",
  label: "text-xs font-medium whitespace-nowrap transition-colors",
  labelActive: "text-gray-700",
  labelLocked: "text-gray-400",
  connector: "flex-1 h-px mx-3 mb-5 transition-colors",
  connectorCompleted: "bg-accent",
  connectorPending: "bg-gray-200",
};

export const stepPlaceholderStyles = {
  container: "flex flex-col flex-1 min-h-0 items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200",
  label: "text-gray-400 text-sm",
};
