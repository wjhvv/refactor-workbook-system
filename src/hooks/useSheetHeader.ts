import { useState, useRef, useMemo } from "react";
import type { ParsedRow, ParsedSheet } from "../types/excel";
import type { ColumnDef } from "../types/displayTable";
import type { LoadedWorkbook } from "../types/workbook";
import { detectHeaderBySelection } from "../services/excel/headerDetector";
import { HEADER_DETECTION_STATUS } from "../types/displayTable";

export interface SheetHeaderState {
  headerRowIndex: number | null;
  columns: ColumnDef[];
  dataRows: ParsedRow[];
  setHeaderRow: (rowIndex: number) => void;
  clearHeaderRow: () => void;
}

/** workbookId → sheetName → headerRowIndex */
type HeaderStateMap = Record<string, Record<string, number | null>>;

function deriveSheetHeaderState(
  sheet: ParsedSheet,
  headerRowIndex: number | null,
  setHeaderRow: (rowIndex: number) => void,
  clearHeaderRow: () => void,
): SheetHeaderState {
  const columns: ColumnDef[] =
    headerRowIndex !== null
      ? (() => {
          const result = detectHeaderBySelection(sheet, [
            String(headerRowIndex),
          ]);
          return result.status === HEADER_DETECTION_STATUS.Found
            ? result.columns
            : [];
        })()
      : [];

  const dataRows: ParsedRow[] =
    headerRowIndex !== null
      ? sheet.rows.filter((r) => r.index > headerRowIndex)
      : sheet.rows;

  return { headerRowIndex, columns, dataRows, setHeaderRow, clearHeaderRow };
}

export function useSheetHeader(
  workbooks: LoadedWorkbook[],
): Record<string, Record<string, SheetHeaderState>> {
  const [headerStateMap, setHeaderStateMap] = useState<HeaderStateMap>({});

  // 找出新增加的 workbook
  const prevWorkbookIdsRef = useRef<Set<string>>(new Set());
  const newWorkbooks = workbooks.filter(
    (lw) => !prevWorkbookIdsRef.current.has(lw.descriptor.id),
  );

  // 如果有新檔案, 將其 sheet 設定為 null
  if (newWorkbooks.length > 0) {
    prevWorkbookIdsRef.current = new Set(
      workbooks.map((lw) => lw.descriptor.id),
    );
    setHeaderStateMap((prev) => {
      const next = { ...prev };
      for (const lw of newWorkbooks) {
        // 為該 workbook 底下的所有 sheet 初始化為 null 狀態
        next[lw.descriptor.id] = Object.fromEntries(
          lw.parsed.sheets.map((s) => [s.name, null]),
        );
      }
      return next;
    });
  }

  function setHeaderRow(
    workbookId: string,
    sheetName: string,
    rowIndex: number,
  ) {
    setHeaderStateMap((prev) => ({
      ...prev,
      [workbookId]: { ...prev[workbookId], [sheetName]: rowIndex },
    }));
  }

  function clearHeaderRow(workbookId: string, sheetName: string) {
    setHeaderStateMap((prev) => ({
      ...prev,
      [workbookId]: { ...prev[workbookId], [sheetName]: null },
    }));
  }

  return useMemo(() => {
    return Object.fromEntries(
      workbooks.map((lw) => {
        const { id: workbookId } = lw.descriptor;
        const sheetStates = Object.fromEntries(
          lw.parsed.sheets.map((sheet) => {
            const headerRowIndex =
              headerStateMap[workbookId]?.[sheet.name] ?? null;
            return [
              sheet.name,
              deriveSheetHeaderState(
                sheet,
                headerRowIndex,
                (rowIndex) => setHeaderRow(workbookId, sheet.name, rowIndex),
                () => clearHeaderRow(workbookId, sheet.name),
              ),
            ];
          }),
        );
        return [workbookId, sheetStates];
      }),
    );
  }, [workbooks, headerStateMap]);
}
