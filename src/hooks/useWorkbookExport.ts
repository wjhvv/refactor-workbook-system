import { useCallback } from "react";
import type { LoadedWorkbook } from "../types/workbook";
import type { SheetHeaderState } from "./useSheetHeader";
import type { SheetSplitState } from "./useSheetSplit";
import { exportWorkbook, exportAllAsZip } from "../services/excel/workbookExport";

export function useWorkbookExport(
  loadedWorkbooks: LoadedWorkbook[],
  tableStates: Record<string, Record<string, SheetHeaderState>>,
  splitStates: Record<string, Record<string, SheetSplitState>>,
) {
  const downloadOne = useCallback(
    (workbookId: string) => {
      const lw = loadedWorkbooks.find((w) => w.descriptor.id === workbookId);
      if (!lw) return;
      exportWorkbook(
        lw,
        tableStates[workbookId] ?? {},
        splitStates[workbookId] ?? {},
        `${lw.descriptor.name}.xlsx`,
      );
    },
    [loadedWorkbooks, tableStates, splitStates],
  );

  const downloadAll = useCallback(() => {
    if (loadedWorkbooks.length === 0) return;
    const filename =
      loadedWorkbooks.length === 1
        ? `${loadedWorkbooks[0].descriptor.name}.zip`
        : "workbooks.zip";
    exportAllAsZip(loadedWorkbooks, tableStates, splitStates, filename);
  }, [loadedWorkbooks, tableStates, splitStates]);

  return { downloadOne, downloadAll };
}
