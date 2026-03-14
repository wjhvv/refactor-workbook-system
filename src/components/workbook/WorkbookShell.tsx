import type { Workbook } from "../../types/workbook";
import type { ReactNode } from "react";
import { useWorkbook } from "../../hooks/useWorkbook";
import { WorkbookTabBar } from "./WorkbookTabBar";
import { SheetTabBar } from "./SheetTabBar";

interface WorkbookShellProps {
  workbooks: Workbook[];
  toolbar?: ReactNode;
  children: (activeWorkbookId: string, activeSheetId: string) => ReactNode;
}

export function WorkbookShell({
  workbooks,
  toolbar,
  children,
}: WorkbookShellProps) {
  const { activeWorkbook, activeSheet, switchWorkbook, switchSheet } =
    useWorkbook(workbooks);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <WorkbookTabBar
        workbooks={workbooks}
        activeWorkbookId={activeWorkbook?.id}
        onWorkbookChange={switchWorkbook}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {toolbar && (
          <div className="border-b border-gray-300 px-4 py-2 bg-white">
            {toolbar}
          </div>
        )}
        <div className="flex-1 overflow-auto">
          {activeWorkbook &&
            activeSheet &&
            children(activeWorkbook.id, activeSheet.id)}
        </div>
      </div>

      <SheetTabBar
        sheets={activeWorkbook?.sheets ?? []}
        activeSheetId={activeSheet?.id}
        onSheetChange={switchSheet}
      />
    </div>
  );
}
