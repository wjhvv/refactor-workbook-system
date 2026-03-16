import type { CSSProperties, ReactNode, RefObject } from "react";
import { X } from "lucide-react";
import { IconButton } from "../IconButton";
import { dropdownStyles } from "./dropdown.styles";

export interface DropdownProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  style?: CSSProperties;
  onClose: () => void;
  children: ReactNode;
}

export function Dropdown({ dropdownRef, style, onClose, children }: DropdownProps) {
  return (
    <div
      ref={dropdownRef}
      className={dropdownStyles.container}
      style={style}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className="absolute top-1.5 right-1.5">
        <IconButton icon={X} onClick={onClose} />
      </span>
      {children}
    </div>
  );
}
