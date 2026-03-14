import { useState } from "react";
import type { Workbook } from "../types/workbook";

export function useWorkbook(initialWorkbooks: Workbook[]) {
  const [workbooks, setWorkbooks] = useState<Workbook[]>(initialWorkbooks);

  const [activeWorkbookId, setActiveWorkbookId] = useState<string | undefined>(
    initialWorkbooks[0]?.id,
  );
  const [activeSheetId, setActiveSheetId] = useState<string | undefined>(
    initialWorkbooks[0]?.sheets[0]?.id,
  );

  const activeWorkbook = workbooks.find((wb) => wb.id == activeWorkbookId);
  const activeSheet = activeWorkbook?.sheets.find(
    (sh) => sh.id === activeSheetId,
  );

  function switchWorkbook(workbookId: string) {
    const workbook = workbooks.find((wb) => wb.id === workbookId);
    setActiveWorkbookId(workbookId);
    setActiveSheetId(workbook?.sheets[0]?.id); // 切換 workbook 時, 預設選取第一個 worksheet
  }

  function switchSheet(worksheetId: string) {
    setActiveSheetId(worksheetId);
  }

  function removeWorkbook(workbookId: string) {
    const index = workbooks.findIndex((wb) => wb.id === workbookId);
    const next = workbooks[index - 1] ?? workbooks[index + 1]; // 優先切換到左邊, 否則切換到右邊的 workbook tab
    setWorkbooks((prev) => prev.filter((wb) => wb.id !== workbookId));
    // 如果移除的是 active workbook, 且存在可以切換的頁面, 就切換過去
    if (workbookId === activeWorkbookId && next) {
      switchWorkbook(next.id);
    }
  }

  return {
    workbooks,
    activeWorkbook,
    activeSheet,
    switchWorkbook,
    switchSheet,
    removeWorkbook,
  };
}
