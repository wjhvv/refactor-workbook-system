import { memo } from "react";
import { getGroupColor } from "../../constants/groupColors";

// ─── GroupPill ────────────────────────────────────────────────────────────────

export interface GroupPillProps {
  rowIndex: number;
  groupNum: number;
  isSelected: boolean;
  isClearMode: boolean;
  onMouseDown: (e: React.MouseEvent, rowIndex: number) => void;
  onMouseEnter: (rowIndex: number) => void;
}

export const GroupPill = memo(function GroupPill({
  rowIndex,
  groupNum,
  isSelected,
  isClearMode,
  onMouseDown,
  onMouseEnter,
}: GroupPillProps) {
  const color = groupNum > 0 ? getGroupColor(groupNum) : null;
  const colorClass =
    isSelected && isClearMode
      ? "bg-gray-200 text-gray-400"
      : isSelected
        ? "bg-blue-500 text-white"
        : groupNum > 0
          ? `${color!.dot} text-white`
          : "bg-gray-100 text-gray-400 hover:bg-gray-200";

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, rowIndex)}
      onMouseEnter={() => onMouseEnter(rowIndex)}
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-medium cursor-ns-resize transition-all select-none ${colorClass}`}
    >
      {groupNum > 0 ? groupNum : "·"}
    </div>
  );
});

// ─── ReadOnlyPill ─────────────────────────────────────────────────────────────

export const ReadOnlyPill = memo(function ReadOnlyPill({ groupNum }: { groupNum: number }) {
  const color = groupNum > 0 ? getGroupColor(groupNum) : null;
  const colorClass =
    groupNum > 0 ? `${color!.dot} text-white` : "bg-gray-100 text-gray-400";

  return (
    <div
      className={`inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-medium select-none ${colorClass}`}
    >
      {groupNum > 0 ? groupNum : "·"}
    </div>
  );
});
