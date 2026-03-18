import { memo } from "react";
import { getGroupColor } from "../../../constants/groupColors";
import { pillBase, pillColorClass, interactivePillColorClass } from "./groupPill.styles";

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
  const dotClass = groupNum > 0 ? getGroupColor(groupNum).dot : "";
  const colorClass = interactivePillColorClass(groupNum, dotClass, isSelected, isClearMode);

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, rowIndex)}
      onMouseEnter={() => onMouseEnter(rowIndex)}
      className={`${pillBase} cursor-ns-resize transition-all ${colorClass}`}
    >
      {groupNum > 0 ? groupNum : "·"}
    </div>
  );
});

// ─── ReadOnlyPill ─────────────────────────────────────────────────────────────

export const ReadOnlyPill = memo(function ReadOnlyPill({ groupNum }: { groupNum: number }) {
  const dotClass = groupNum > 0 ? getGroupColor(groupNum).dot : "";
  const colorClass = pillColorClass(groupNum, dotClass);

  return (
    <div className={`${pillBase} ${colorClass}`}>
      {groupNum > 0 ? groupNum : "·"}
    </div>
  );
});
