export const GROUP_COLORS = [
  { row: "bg-emerald-50 border-b border-emerald-200", cell: "text-emerald-800", dot: "bg-emerald-400", ring: "ring-emerald-400" },
  { row: "bg-sky-50 border-b border-sky-200",         cell: "text-sky-800",     dot: "bg-sky-400",     ring: "ring-sky-400"     },
  { row: "bg-violet-50 border-b border-violet-200",   cell: "text-violet-800",  dot: "bg-violet-400",  ring: "ring-violet-400"  },
  { row: "bg-amber-50 border-b border-amber-200",     cell: "text-amber-800",   dot: "bg-amber-400",   ring: "ring-amber-400"   },
  { row: "bg-rose-50 border-b border-rose-200",       cell: "text-rose-800",    dot: "bg-rose-400",    ring: "ring-rose-400"    },
] as const;

export function getGroupColor(groupNum: number) {
  return GROUP_COLORS[(groupNum - 1) % GROUP_COLORS.length];
}
