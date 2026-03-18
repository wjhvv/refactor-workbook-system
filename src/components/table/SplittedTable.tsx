import { useMemo } from "react";
import { VirtualTable } from "./VirtualTable";
import type { VirtualTableColumn } from "./VirtualTable";
import { SplitPanel } from "../panel";
import { useRowGroupPainter } from "../../hooks/workbook/useRowGroupPainter";
import { tableStyles as t } from "./table.styles";
import type { SheetHeaderState } from "../../hooks/workbook/useSheetHeader";
import type { SheetSplitState } from "../../hooks/workbook/useSheetSplit";
import type { ParsedSheet, ParsedRow, ParsedColumn } from "../../types/excel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EXCEL_CHAR_TO_PX = 7;
const DEFAULT_COL_WIDTH = 100;

function excelColToPixels(col: ParsedColumn | undefined): number {
  if (col?.width != null)
    return Math.max(60, Math.round(col.width * EXCEL_CHAR_TO_PX));
  return DEFAULT_COL_WIDTH;
}

function getRowLabel(rowIndex: number, headerRowIndex: number | null): string {
  if (headerRowIndex === null) return String(rowIndex);
  if (rowIndex > headerRowIndex) return String(rowIndex - headerRowIndex);
  return String(rowIndex);
}

function buildColKeys(sheet: ParsedSheet): string[] {
  let colCount = sheet.columns.length;
  for (const row of sheet.rows) {
    const n = Object.keys(row.cells).length;
    if (n > colCount) colCount = n;
  }
  return Array.from({ length: colCount }, (_, i) => String(i + 1));
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SplittedTableProps {
  sheet: ParsedSheet;
  tableState: SheetHeaderState;
  splitState: SheetSplitState;
}

export function SplittedTable({ sheet, tableState, splitState }: SplittedTableProps) {
  const { headerRowIndex, dataRows, columns, setHeaderRow, clearHeaderRow } = tableState;
  const { splitMode, splitColKey, setSplitColKey, setSplitMode, displayRowGroupMap, maxGroup, paintRows } =
    splitState;

  const isColumnMode = splitMode === "column";
  const isRowMode = splitMode === "row";

  const colKeys = useMemo(() => buildColKeys(sheet), [sheet]);

  const headerRow = useMemo(
    () =>
      headerRowIndex !== null
        ? (sheet.rows.find((r) => r.index === headerRowIndex) ?? null)
        : null,
    [sheet.rows, headerRowIndex],
  );

  const displayRows = headerRowIndex !== null ? dataRows : sheet.rows;

  const dataRowIndices = useMemo(
    () => displayRows.map((r) => r.index),
    [displayRows],
  );

  const painter = useRowGroupPainter({
    rowGroupMap: displayRowGroupMap,
    maxGroup,
    onPaintRows: paintRows,
    dataRowIndices,
    readOnly: isColumnMode,
  });

  // ── Column definitions ───────────────────────────────────────────────────
  const vtColumns = useMemo((): VirtualTableColumn<ParsedRow>[] => {
    return colKeys.map((key, i) => ({
      key,
      label: headerRow ? String(headerRow.cells[key]?.value ?? "") : key,
      width: excelColToPixels(sheet.columns[i]),
      headerClass: isColumnMode
        ? key === splitColKey
          ? t.headerCellAccent
          : t.headerCellInteractive
        : undefined,
      renderCell: (row) => {
        const value = row.cells[key]?.value;
        return value != null ? String(value) : "";
      },
    }));
  }, [colKeys, headerRow, sheet.columns, isColumnMode, splitColKey]);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <VirtualTable<ParsedRow>
        rows={displayRows}
        columns={vtColumns}
        getRowKey={(row) => row.index}
        getRowClass={(row) => painter.getRowClass(row.index)}
        getCellClass={(row, colKey) => {
          const value = row.cells[colKey]?.value;
          if (value == null) return t.cellEmpty;
          return painter.getCellClass(row.index, colKey, value);
        }}
        onRowClick={
          headerRowIndex === null
            ? (row) => setHeaderRow(row.index)
            : undefined
        }
        onHeaderCellClick={
          isColumnMode
            ? (colKey) =>
                setSplitColKey(splitColKey === colKey ? null : colKey)
            : undefined
        }
        renderLeadingCell={
          splitMode !== null
            ? (row) => painter.renderLeadingCell(row.index)
            : undefined
        }
        noSelect={isRowMode && !!painter.isDraggingRef.current}
        headerActions={
          headerRowIndex !== null ? (
            <button
              onClick={clearHeaderRow}
              className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              重新設定表頭
            </button>
          ) : undefined
        }
        getRowLabel={(row) => getRowLabel(row.index, headerRowIndex)}
        emptyMessage="此工作表沒有資料"
      />

      {isRowMode && painter.dropdownEl}

      {headerRowIndex !== null && columns.length > 0 && (
        <SplitPanel splitMode={splitMode} onSplitModeChange={setSplitMode} />
      )}
    </div>
  );
}
