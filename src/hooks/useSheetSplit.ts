import { useState, useRef, useMemo, useCallback } from "react";
import type { ParsedSheet } from "../types/excel";
import type { LoadedWorkbook } from "../types/workbook";
import type { SplitTable } from "../types/displayTable";
import { groupByColumn } from "../services/excel/groupByColumn";
import { groupByRow } from "../services/excel/groupByRow";

export type SplitMode = "column" | "row" | null;

// 內部: 儲存「如何分組」的條件, 不存計算後的結果
interface SheetSplitParams {
  splitMode: SplitMode;
  splitColKey: string | null;
  rowGroupMap: Record<number, number>;
}

// 對外: 設定 + 計算後的表格資料 + 操作函數
export interface SheetSplitState {
  splitMode: SplitMode;
  splitColKey: string | null;
  splitTables: SplitTable[];
  maxGroup: number;
  displayRowGroupMap: Record<number, number>;
  setSplitMode: (mode: SplitMode) => void;
  setSplitColKey: (colKey: string | null) => void;
  paintRows: (indices: number[], groupNum: number) => void;
}

// 透過快取記憶上一次的計算結果
interface SplitDerivedCache {
  headerRowIndex: number | null;
  splitMode: SplitMode;
  splitColKey: string | null;
  rowGroupMap: Record<number, number>;
  splitTables: SplitTable[];
  maxGroup: number;
  displayRowGroupMap: Record<number, number>;
}

/** workbookId → sheetName → SheetSplitParams */
type SplitStateMap = Record<string, Record<string, SheetSplitParams>>;

/** workbookId → sheetName → SplitDerivedCache */
type SplitCacheMap = Record<string, Record<string, SplitDerivedCache>>;

const EMPTY_GROUPS: SplitTable[] = [];

const INITIAL_SPLIT_PARAMS: SheetSplitParams = {
  splitMode: null,
  splitColKey: null,
  rowGroupMap: {},
};

function deriveGroups(
  sheet: ParsedSheet,
  headerRowIndex: number | null,
  splitMode: SplitMode,
  splitColKey: string | null,
  rowGroupMap: Record<number, number>,
): SplitTable[] {
  if (headerRowIndex === null) return EMPTY_GROUPS;
  if (splitMode === "column" && splitColKey !== null)
    return groupByColumn(sheet, headerRowIndex, splitColKey);
  if (splitMode === "row" && Object.keys(rowGroupMap).length > 0)
    return groupByRow(sheet, headerRowIndex, rowGroupMap);
  return EMPTY_GROUPS;
}

export function useSheetSplit(
  workbooks: LoadedWorkbook[],
  headerMap: Record<string, Record<string, number | null>>,
): Record<string, Record<string, SheetSplitState>> {
  const [splitStateMap, setSplitStateMap] = useState<SplitStateMap>({});

  // 當新 workbook 加入時，在 render 期間同步初始化
  const prevWorkbookIdsRef = useRef<Set<string>>(new Set());
  const newWorkbooks = workbooks.filter(
    (lw) => !prevWorkbookIdsRef.current.has(lw.descriptor.id),
  );
  if (newWorkbooks.length > 0) {
    prevWorkbookIdsRef.current = new Set(workbooks.map((lw) => lw.descriptor.id));
    setSplitStateMap((prev) => {
      const next = { ...prev };
      for (const lw of newWorkbooks) {
        next[lw.descriptor.id] = Object.fromEntries(
          lw.parsed.sheets.map((s) => [s.name, { ...INITIAL_SPLIT_PARAMS }]),
        );
      }
      return next;
    });
  }

  // 當 headerMap 改變時，重置受影響 sheet 的 split 狀態
  const prevHeaderMapRef = useRef(headerMap);
  if (prevHeaderMapRef.current !== headerMap) {
    const prev = prevHeaderMapRef.current;
    prevHeaderMapRef.current = headerMap;

    const sheetsToReset: Array<{ workbookId: string; sheetName: string }> = [];
    for (const lw of workbooks) {
      const wid = lw.descriptor.id;
      for (const sheet of lw.parsed.sheets) {
        if (prev[wid]?.[sheet.name] !== headerMap[wid]?.[sheet.name]) {
          sheetsToReset.push({ workbookId: wid, sheetName: sheet.name });
        }
      }
    }

    if (sheetsToReset.length > 0) {
      setSplitStateMap((current) => {
        const next = { ...current };
        for (const { workbookId, sheetName } of sheetsToReset) {
          next[workbookId] = {
            ...next[workbookId],
            [sheetName]: { ...INITIAL_SPLIT_PARAMS },
          };
        }
        return next;
      });
    }
  }

  const setSplitMode = useCallback(
    (workbookId: string, sheetName: string, mode: SplitMode) => {
      setSplitStateMap((prev) => ({
        ...prev,
        [workbookId]: {
          ...prev[workbookId],
          [sheetName]: { splitMode: mode, splitColKey: null, rowGroupMap: {} },
        },
      }));
    },
    [],
  );

  const setSplitColKey = useCallback(
    (workbookId: string, sheetName: string, colKey: string | null) => {
      setSplitStateMap((prev) => ({
        ...prev,
        [workbookId]: {
          ...prev[workbookId],
          [sheetName]: { ...prev[workbookId]?.[sheetName], splitColKey: colKey },
        },
      }));
    },
    [],
  );

  const paintRows = useCallback(
    (workbookId: string, sheetName: string, indices: number[], groupNum: number) => {
      setSplitStateMap((prev) => {
        const next = { ...(prev[workbookId]?.[sheetName]?.rowGroupMap ?? {}) };
        for (const idx of indices) {
          if (groupNum === 0) delete next[idx];
          else next[idx] = groupNum;
        }
        return {
          ...prev,
          [workbookId]: {
            ...prev[workbookId],
            [sheetName]: { ...prev[workbookId]?.[sheetName], rowGroupMap: next },
          },
        };
      });
    },
    [],
  );

  const splitCacheRef = useRef<SplitCacheMap>({});

  return useMemo(() => {
    return Object.fromEntries(
      workbooks.map((lw) => {
        const { id: workbookId } = lw.descriptor;
        const sheetStates = Object.fromEntries(
          lw.parsed.sheets.map((sheet) => {
            const { splitMode, splitColKey, rowGroupMap } =
              splitStateMap[workbookId]?.[sheet.name] ?? INITIAL_SPLIT_PARAMS;
            const headerRowIndex = headerMap[workbookId]?.[sheet.name] ?? null;

            const cached = splitCacheRef.current[workbookId]?.[sheet.name];
            const isHit =
              cached !== undefined &&
              cached.headerRowIndex === headerRowIndex &&
              cached.splitMode === splitMode &&
              cached.splitColKey === splitColKey &&
              cached.rowGroupMap === rowGroupMap;

            let splitTables: SplitTable[];
            let maxGroup: number;
            let displayRowGroupMap: Record<number, number>;

            if (isHit) {
              ({ splitTables, maxGroup, displayRowGroupMap } = cached);
            } else {
              splitTables = deriveGroups(
                sheet,
                headerRowIndex,
                splitMode,
                splitColKey,
                rowGroupMap,
              );
              maxGroup = Object.values(rowGroupMap).reduce(
                (max, v) => (v > max ? v : max),
                0,
              );
              if (splitMode === "column") {
                displayRowGroupMap = {};
                splitTables.forEach((table, i) => {
                  for (const row of table.dataRows)
                    displayRowGroupMap[row.index] = i + 1;
                });
              } else {
                displayRowGroupMap = rowGroupMap;
              }

              if (!splitCacheRef.current[workbookId]) {
                splitCacheRef.current[workbookId] = {};
              }
              splitCacheRef.current[workbookId][sheet.name] = {
                headerRowIndex,
                splitMode,
                splitColKey,
                rowGroupMap,
                splitTables,
                maxGroup,
                displayRowGroupMap,
              };
            }

            return [
              sheet.name,
              {
                splitMode,
                splitColKey,
                splitTables,
                maxGroup,
                displayRowGroupMap,
                setSplitMode: (mode: SplitMode) =>
                  setSplitMode(workbookId, sheet.name, mode),
                setSplitColKey: (colKey: string | null) =>
                  setSplitColKey(workbookId, sheet.name, colKey),
                paintRows: (indices: number[], groupNum: number) =>
                  paintRows(workbookId, sheet.name, indices, groupNum),
              } satisfies SheetSplitState,
            ];
          }),
        );
        return [workbookId, sheetStates];
      }),
    );
  }, [workbooks, headerMap, splitStateMap, setSplitMode, setSplitColKey, paintRows]);
}
