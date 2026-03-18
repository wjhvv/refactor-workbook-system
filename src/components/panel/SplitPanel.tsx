import type { SplitMode } from "../../hooks/workbook/useSheetSplit";
import { TogglePanel } from "./TogglePanel";

const SPLIT_MODES: { value: NonNullable<SplitMode>; label: string }[] = [
  { value: "column", label: "依欄位" },
  { value: "row", label: "依列" },
];

interface SplitPanelProps {
  splitMode: SplitMode;
  onSplitModeChange: (mode: SplitMode) => void;
}

export function SplitPanel({ splitMode, onSplitModeChange }: SplitPanelProps) {
  return (
    <TogglePanel
      label="分割方式"
      options={SPLIT_MODES}
      selected={splitMode}
      onChange={onSplitModeChange}
    />
  );
}
