import type { ReactNode } from "react";
import { dropdownStyles } from "./dropdown.styles";

interface DropdownItemProps {
  leading: ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}

export function DropdownItem({ leading, label, active = false, danger = false, onClick }: DropdownItemProps) {
  return (
    <button onClick={onClick} className={dropdownStyles.item(active, danger)}>
      <span className={dropdownStyles.itemLeading}>{leading}</span>
      <span>{label}</span>
      {active && <span className="ml-auto text-gray-400">✓</span>}
    </button>
  );
}
