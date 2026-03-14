import type { Workbook } from "../../types/workbook";
import { Trash2, Download } from "lucide-react";
import { tabStyles } from "./workbook.styles";
import { IconButton } from "../ui/IconButton";

interface WorkbookTabBarProps {
  workbooks: Workbook[];
  activeWorkbookId: string | undefined;
  onWorkbookChange: (workbookId: string) => void;
  onWorkbookRemove: (workbookId: string) => void;
}

export function WorkbookTabBar({
  workbooks,
  activeWorkbookId,
  onWorkbookChange,
  onWorkbookRemove,
}: WorkbookTabBarProps) {
  return (
    <div className="flex items-end border-b border-gray-200 overflow-x-auto">
      {workbooks.map((workbook) => {
        const isActive = workbook.id === activeWorkbookId;
        return (
          <button
            key={workbook.id}
            onClick={() => onWorkbookChange(workbook.id)}
            className={`group ${isActive ? tabStyles.active : tabStyles.inactive}`}
          >
            <span className="max-w-36 truncate font-bold">{workbook.name}</span>
            <div className="flex items-center gap-2">
              <IconButton
                icon={Download}
                variant="primary"
                onClick={() => {}}
              />
              <IconButton
                icon={Trash2}
                variant="danger"
                onClick={() => onWorkbookRemove(workbook.id)}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
