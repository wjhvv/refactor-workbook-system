import { useRef, useMemo, memo, forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { tableStyles } from "./table.styles";
import type { ParsedSheet, ParsedRow, ParsedColumn } from "../../types/excel";
import type { TableFeatureProps } from "../../types/tableFeature";

export interface RawSheetViewProps extends Pick<
  TableFeatureProps,
  | "getRowClass"
  | "getCellClass"
  | "getHeaderCellClass"
  | "onRowClick"
  | "onHeaderCellClick"
  | "renderLeadingCell"
  | "headerActions"
  | "noSelect"
> {
  sheet: ParsedSheet;
  headerRowIndex?: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROW_HEIGHT = 33; // initial estimate for virtualizer; actual height measured at runtime
const DEFAULT_COL_WIDTH = 100; // px, fallback when Excel provides no width
const EXCEL_CHAR_TO_PX = 7; // ~7px per Excel character unit (11pt Calibri)
const LEADING_COL_WIDTH = 28; // colgroup source of truth for the group-pill column
const INDEX_COL_WIDTH = 32; // colgroup source of truth for the row-index column

// ─── Helpers ─────────────────────────────────────────────────────────────────

function excelColToPixels(col: ParsedColumn | undefined): number {
  if (col?.width != null)
    return Math.max(60, Math.round(col.width * EXCEL_CHAR_TO_PX));
  return DEFAULT_COL_WIDTH;
}

// 計算相較於 header row 的 index
function getRowLabel(rowIndex: number, headerRowIndex: number | null): string {
  if (headerRowIndex === null) return String(rowIndex);
  if (rowIndex > headerRowIndex) return String(rowIndex - headerRowIndex);
  return String(rowIndex);
}

// ─── ColumnWidthDefs ──────────────────────────────────────────────────────────

interface ColumnWidthDefsProps {
  colKeys: string[];
  columns: ParsedColumn[];
  hasLeadingCell: boolean;
}

const ColumnWidthDefs = memo(function ColumnWidthDefs({
  colKeys,
  columns,
  hasLeadingCell,
}: ColumnWidthDefsProps) {
  return (
    <colgroup>
      {hasLeadingCell && <col style={{ width: LEADING_COL_WIDTH }} />}
      <col style={{ width: INDEX_COL_WIDTH }} />
      {colKeys.map((k, i) => (
        <col key={k} style={{ width: excelColToPixels(columns[i]) }} />
      ))}
    </colgroup>
  );
});

// ─── HeaderRow ────────────────────────────────────────────────────────────────

interface HeaderRowProps {
  row: ParsedRow;
  colKeys: string[];
  hasLeadingCell: boolean;
  getHeaderCellClass?: (colKey: string) => string | undefined;
  onHeaderCellClick?: (colKey: string) => void;
}

const HeaderRow = memo(function HeaderRow({
  row,
  colKeys,
  hasLeadingCell,
  getHeaderCellClass,
  onHeaderCellClick,
}: HeaderRowProps) {
  return (
    <tr className={tableStyles.rawRowSelected}>
      {hasLeadingCell && <th className="px-1 py-0" />}
      <th className={tableStyles.rawRowIndexSelected} />
      {colKeys.map((colKey) => {
        const cellClass =
          getHeaderCellClass?.(colKey) ??
          (onHeaderCellClick
            ? tableStyles.rawCellSelectedInteractive
            : tableStyles.rawCellSelected);
        return (
          <th
            key={colKey}
            onClick={
              onHeaderCellClick
                ? (e) => {
                    e.stopPropagation();
                    onHeaderCellClick(colKey);
                  }
                : undefined
            }
            className={cellClass}
          >
            {row.cells[colKey]?.value ?? ""}
          </th>
        );
      })}
    </tr>
  );
});

// ─── SheetRow ─────────────────────────────────────────────────────────────────

interface SheetRowProps {
  row: ParsedRow;
  vIndex: number;
  headerRowIndex: number | null;
  colKeys: string[];
  onRowClick?: (rowIndex: number) => void;
  renderLeadingCell?: (rowIndex: number) => ReactNode;
  getRowClass?: (rowIndex: number) => string | undefined;
  getCellClass?: (
    rowIndex: number,
    colKey: string,
    value: unknown,
  ) => string | undefined;
}

const SheetRow = memo(
  forwardRef<HTMLTableRowElement, SheetRowProps>(function SheetRow(
    {
      row,
      vIndex,
      headerRowIndex,
      colKeys,
      onRowClick,
      renderLeadingCell,
      getRowClass,
      getCellClass,
    },
    ref,
  ) {
    const isDataRow = headerRowIndex !== null && row.index > headerRowIndex;
    const rowClass = getRowClass?.(row.index) ?? tableStyles.rawRow;

    return (
      <tr
        ref={ref}
        data-index={vIndex}
        onClick={onRowClick ? () => onRowClick(row.index) : undefined}
        className={rowClass}
      >
        {renderLeadingCell && (
          <td className="px-1 py-0 text-center">
            {isDataRow ? renderLeadingCell(row.index) : null}
          </td>
        )}

        <td className="px-2 py-1.5 text-xs text-right select-none w-8 whitespace-nowrap text-gray-300">
          {getRowLabel(row.index, headerRowIndex)}
        </td>

        {colKeys.map((colKey) => {
          const value = row.cells[colKey]?.value;
          const cellClass =
            getCellClass?.(row.index, colKey, value) ??
            (value != null ? tableStyles.rawCell : tableStyles.rawCellEmpty);
          return (
            <td key={colKey} className={cellClass}>
              {value ?? ""}
            </td>
          );
        })}
      </tr>
    );
  }),
);


// ─── Component ───────────────────────────────────────────────────────────────

export function RawSheetView({
  sheet,
  headerRowIndex = null,
  onRowClick,
  headerActions,
  renderLeadingCell,
  getRowClass,
  getCellClass,
  getHeaderCellClass,
  onHeaderCellClick,
  noSelect,
}: RawSheetViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Column keys ─────────────────────────────────────────────────────────
  // Use a loop instead of Math.max(...spread) to avoid a stack overflow on
  // sheets with thousands of columns.
  const colKeys = useMemo(() => {
    let colCount = sheet.columns.length;
    for (const row of sheet.rows) {
      const n = Object.keys(row.cells).length;
      if (n > colCount) colCount = n;
    }
    return Array.from({ length: colCount }, (_, i) => String(i + 1));
  }, [sheet]);

  // ── Header row ──────────────────────────────────────────────────────────
  const headerRow = useMemo(
    () =>
      headerRowIndex !== null
        ? (sheet.rows.find((r) => r.index === headerRowIndex) ?? null)
        : null,
    [sheet.rows, headerRowIndex],
  );

  // ── Body rows ───────────────────────────────────────────────────────────
  const bodyRowOffset = useMemo(
    () =>
      headerRowIndex !== null
        ? sheet.rows.findIndex((r) => r.index > headerRowIndex)
        : 0,
    [sheet.rows, headerRowIndex],
  );
  const bodyCount = sheet.rows.length - bodyRowOffset;

  // ── Virtualizer ─────────────────────────────────────────────────────────
  const virtualizer = useVirtualizer({
    count: bodyCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Spacer heights that fill the gap between the DOM window and the full list.
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0);

  // leading col (optional) + index col + data cols
  const totalColSpan = useMemo(
    () => (renderLeadingCell ? 1 : 0) + 1 + colKeys.length,
    [renderLeadingCell, colKeys.length],
  );

  const wrapperStyle = useMemo<CSSProperties | undefined>(
    () => (noSelect ? { userSelect: "none" } : undefined),
    [noSelect],
  );

  if (sheet.rows.length === 0) {
    return (
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        {headerActions && (
          <div className="flex justify-end">{headerActions}</div>
        )}
        <div className={tableStyles.rawWrapper}>
          <div className="flex items-center justify-center h-20 text-sm text-gray-400">
            此工作表沒有資料
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 flex-1 min-h-0">
      {headerActions && <div className="flex justify-end">{headerActions}</div>}
      <div
        ref={scrollRef}
        className={tableStyles.rawWrapper}
        style={wrapperStyle}
      >
        <table className={tableStyles.rawTable}>
          <ColumnWidthDefs
            colKeys={colKeys}
            columns={sheet.columns}
            hasLeadingCell={!!renderLeadingCell}
          />

          {headerRow && (
            <thead className="sticky top-0 z-10">
              <HeaderRow
                row={headerRow}
                colKeys={colKeys}
                hasLeadingCell={!!renderLeadingCell}
                getHeaderCellClass={getHeaderCellClass}
                onHeaderCellClick={onHeaderCellClick}
              />
            </thead>
          )}

          <tbody>
            {paddingTop > 0 && (
              <tr aria-hidden><td colSpan={totalColSpan} style={{ height: paddingTop, padding: 0 }} /></tr>
            )}

            {virtualItems.map((vRow) => {
              const row = sheet.rows[bodyRowOffset + vRow.index];
              return (
                <SheetRow
                  key={row.index}
                  ref={virtualizer.measureElement}
                  vIndex={vRow.index}
                  row={row}
                  headerRowIndex={headerRowIndex}
                  colKeys={colKeys}
                  onRowClick={onRowClick}
                  renderLeadingCell={renderLeadingCell}
                  getRowClass={getRowClass}
                  getCellClass={getCellClass}
                />
              );
            })}

            {paddingBottom > 0 && (
              <tr aria-hidden><td colSpan={totalColSpan} style={{ height: paddingBottom, padding: 0 }} /></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
