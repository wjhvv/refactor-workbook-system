import type { Workbook } from "../../types/workbook";
import { workbookTabStyles } from "./styles/workbook.styles";

interface WorkbookTabBarProps {
  workbooks: Workbook[];
  activeWorkbookId: string | undefined;
  onWorkbookChange: (workbookId: string) => void;
}

export function WorkbookTabBar({
  workbooks,
  activeWorkbookId,
  onWorkbookChange,
}: WorkbookTabBarProps) {
  return (
    <div className="flex items-end border-b border-gray-200 overflow-x-auto">
      {workbooks.map((workbook) => {
        const isActive = workbook.id === activeWorkbookId;
        return (
          <div
            key={workbook.id}
            onClick={() => onWorkbookChange(workbook.id)}
            className={
              isActive ? workbookTabStyles.active : workbookTabStyles.inactive
            }
          >
            <span className="max-w-36 truncate">{workbook.name}</span>
          </div>
        );
      })}
    </div>
  );
}
