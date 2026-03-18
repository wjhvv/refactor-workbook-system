import { useState, useRef, useMemo, useCallback } from "react";
import type { ParsedSheet } from "../../types/excel";
import type { LoadedWorkbook } from "../../types/workbook";
import type { SplitTable } from "../../types/displayTable";
import { groupByColumn } from "../../services/excel/groupByColumn";
import { groupByRow } from "../../services/excel/groupByRow";
import { getMaxGroupNumber } from "../../utils/groupUtils";
import { updateNested2 } from "../../utils/nestedState";

export type SplitMode = "column" | "row" | null;

interface SheetSplitParams {
  splitMode: SplitMode;
  splitColKey: string | null;
  rowGroupMap: Record<number, number>;
}

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

interface SplitDerivedCache {
  headerRowIndex: number | null;
  splitMode: SplitMode;
  splitColKey: string | null;
  rowGroupMap: Record<number, number>;
  splitTables: SplitTable[];
  maxGroup: number;
  displayRowGroupMap: Record<number, number>;
}

type SplitStateMap = Record<string, Record<string, SheetSplitParams>>;
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
  headerMap: Record<string, Record<string, { headerRowIndex: number | null }>>,
): Record<string, Record<string, SheetSplitState>> {
  const [splitStateMap, setSplitStateMap] = useState<SplitStateMap>({});

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

  const prevHeaderMapRef = useRef(headerMap);
  if (prevHeaderMapRef.current !== headerMap) {
    const prev = prevHeaderMapRef.current;
    prevHeaderMapRef.current = headerMap;

    const sheetsToReset: Array<{ workbookId: string; sheetName: string }> = [];
    for (const lw of workbooks) {
      const wid = lw.descriptor.id;
      for (const sheet of lw.parsed.sheets) {
        if (prev[wid]?.[sheet.name]?.headerRowIndex !== headerMap[wid]?.[sheet.name]?.headerRowIndex) {
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
      updateNested2(setSplitStateMap, workbookId, sheetName, {
        splitMode: mode,
        splitColKey: null,
        rowGroupMap: {},
      });
    },
    [],
  );

  const setSplitColKey = useCallback(
    (workbookId: string, sheetName: string, colKey: string | null) => {
      updateNested2(setSplitStateMap, workbookId, sheetName, (prev) => ({
        ...(prev ?? INITIAL_SPLIT_PARAMS),
        splitColKey: colKey,
      }));
    },
    [],
  );

  const paintRows = useCallback(
    (workbookId: string, sheetName: string, indices: number[], groupNum: number) => {
      updateNested2(setSplitStateMap, workbookId, sheetName, (prev) => {
        const next = { ...(prev?.rowGroupMap ?? {}) };
        for (const idx of indices) {
          if (groupNum === 0) delete next[idx];
          else next[idx] = groupNum;
        }
        return { ...(prev ?? INITIAL_SPLIT_PARAMS), rowGroupMap: next };
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
            const headerRowIndex = headerMap[workbookId]?.[sheet.name]?.headerRowIndex ?? null;

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
              splitTables = deriveGroups(sheet, headerRowIndex, splitMode, splitColKey, rowGroupMap);
              maxGroup = getMaxGroupNumber(rowGroupMap);
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
                setSplitMode: (mode: SplitMode) => setSplitMode(workbookId, sheet.name, mode),
                setSplitColKey: (colKey: string | null) => setSplitColKey(workbookId, sheet.name, colKey),
                paintRows: (indices: number[], groupNum: number) => paintRows(workbookId, sheet.name, indices, groupNum),
              } satisfies SheetSplitState,
            ];
          }),
        );
        return [workbookId, sheetStates];
      }),
    );
  }, [workbooks, headerMap, splitStateMap, setSplitMode, setSplitColKey, paintRows]);
}
