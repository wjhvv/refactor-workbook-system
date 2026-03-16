import type { Workbook } from "../../types/workbook";
import type { ReactNode } from "react";
import { WorkbookTabBar } from "./WorkbookTabBar";
import { SheetTabBar } from "./SheetTabBar";

interface WorkbookShellProps {
  workbooks: Workbook[];
  activeWorkbookId: string | undefined;
  activeSheetId: string | undefined;
  onWorkbookChange: (id: string) => void;
  onWorkbookRemove: (id: string) => void;
  onWorkbookDownload: (id: string) => void;
  onAddWorkbook: (files: File[]) => void;
  onSheetChange: (id: string) => void;
  toolbar?: ReactNode;
  children: (activeWorkbookId: string, activeSheetId: string) => ReactNode;
}

export function WorkbookShell({
  workbooks,
  activeWorkbookId,
  activeSheetId,
  onWorkbookChange,
  onWorkbookRemove,
  onWorkbookDownload,
  onAddWorkbook,
  onSheetChange,
  toolbar,
  children,
}: WorkbookShellProps) {
  const activeWorkbook = workbooks.find((w) => w.id === activeWorkbookId);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <WorkbookTabBar
        workbooks={workbooks}
        activeWorkbookId={activeWorkbookId}
        onWorkbookChange={onWorkbookChange}
        onWorkbookRemove={onWorkbookRemove}
        onWorkbookDownload={onWorkbookDownload}
        onAddWorkbook={onAddWorkbook}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        {toolbar && (
          <div className="border-b border-gray-300 px-4 py-2 bg-white">
            {toolbar}
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeWorkbookId &&
            activeSheetId &&
            children(activeWorkbookId, activeSheetId)}
        </div>
      </div>

      <SheetTabBar
        sheets={activeWorkbook?.sheets ?? []}
        activeSheetId={activeSheetId}
        onSheetChange={onSheetChange}
      />
    </div>
  );
}
