import type { CSSProperties, RefObject } from "react";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";
import { dropdownStyles } from "./dropdown.styles";
import { getGroupColor } from "../../../constants/groupColors";

interface GroupPainterDropdownProps {
  style: CSSProperties;
  dropdownRef: RefObject<HTMLDivElement | null>;
  maxGroup: number;
  currentGroup: number | null;
  canAddGroup: boolean;
  hasAssigned: boolean;
  onAssign: (groupNum: number) => void;
  onClose: () => void;
}

function GroupDot({ num }: { num: number }) {
  const c = getGroupColor(num);
  return (
    <span
      className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center text-white ${c.dot}`}
    >
      {num}
    </span>
  );
}

export function GroupPainterDropdown({
  style,
  dropdownRef,
  maxGroup,
  currentGroup,
  canAddGroup,
  hasAssigned,
  onAssign,
  onClose,
}: GroupPainterDropdownProps) {
  return (
    <Dropdown dropdownRef={dropdownRef} style={style} onClose={onClose}>
      {Array.from({ length: maxGroup }, (_, i) => i + 1).map((gNum) => (
        <DropdownItem
          key={gNum}
          leading={<GroupDot num={gNum} />}
          label={`組 ${gNum}`}
          active={currentGroup === gNum}
          onClick={() => onAssign(gNum)}
        />
      ))}

      <div className={dropdownStyles.divider}>
        {canAddGroup && (
          <DropdownItem
            leading={
              <span className="w-4 h-4 rounded border border-dashed border-gray-300 flex items-center justify-center text-[10px] text-gray-400">
                +
              </span>
            }
            label={`新增組 ${maxGroup + 1}`}
            onClick={() => onAssign(maxGroup + 1)}
          />
        )}
        {hasAssigned && (
          <DropdownItem
            leading={<span className="text-[10px]">✕</span>}
            label="清除分組"
            danger
            onClick={() => onAssign(0)}
          />
        )}
      </div>
    </Dropdown>
  );
}
