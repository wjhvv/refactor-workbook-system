import type { Sheet } from "../../types/workbook";
import { sheetTabStyles } from "./styles/workbook.styles";

interface SheetTabBarProps {
  sheets: Sheet[];
  activeSheetId: string | undefined;
  onSheetChange: (sheetId: string) => void;
}

export function SheetTabBar({
  sheets,
  activeSheetId,
  onSheetChange,
}: SheetTabBarProps) {
  if (sheets.length <= 1) return null;

  return (
    <div className="flex items-end border-t border-gray-200 overflow-x-auto">
      {sheets.map((sheet) => {
        const isActive = sheet.id === activeSheetId;
        return (
          <button
            key={sheet.id}
            onClick={() => onSheetChange(sheet.id)}
            className={
              isActive ? sheetTabStyles.active : sheetTabStyles.inactive
            }
          >
            {sheet.name}
          </button>
        );
      })}
    </div>
  );
}
