import { useState } from "react";
import type { Workbook } from "../types/workbook";

export function useWorkbook(workbooks: Workbook[]) {
  const [activeWorkbookId, setActiveWorkbookId] = useState<string | undefined>(
    workbooks[0]?.id,
  );
  const [activeSheetId, setActiveSheetId] = useState<string | undefined>(
    workbooks[0]?.sheets[0]?.id,
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

  return {
    activeWorkbook,
    activeSheet,
    switchWorkbook,
    switchSheet,
  };
}
