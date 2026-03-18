export const pillBase =
  "inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-medium select-none";

export function pillColorClass(groupNum: number, dotClass: string): string {
  return groupNum > 0 ? `${dotClass} text-white` : "bg-gray-100 text-gray-400";
}

export function interactivePillColorClass(
  groupNum: number,
  dotClass: string,
  isSelected: boolean,
  isClearMode: boolean,
): string {
  if (isSelected && isClearMode) return "bg-gray-200 text-gray-400";
  if (isSelected) return "bg-blue-500 text-white";
  return pillColorClass(groupNum, dotClass);
}
