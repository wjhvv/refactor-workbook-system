import { useRef, useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { tableStyles as t } from "./table.styles";
import type { SortDir } from "../../hooks/ui/useTableControls";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VirtualTableColumn<T> {
  key: string;
  label: ReactNode;
  /** Column width in px. Defaults to 100. */
  width?: number;
  /** Override the header cell class entirely (e.g. accent for split-selected column). */
  headerClass?: string;
  sortDir?: SortDir | null;
  onSort?: () => void;
  renderCell?: (row: T) => ReactNode;
}

export interface VirtualTableProps<T> {
  rows: T[];
  columns: VirtualTableColumn<T>[];
  getRowKey: (row: T) => string | number;

  // Row/cell class overrides
  getRowClass?: (row: T) => string | undefined;
  getCellClass?: (row: T, colKey: string) => string | undefined;

  // Header interactions (e.g. selecting split column)
  onHeaderCellClick?: (colKey: string) => void;

  // Row interactions
  onRowClick?: (row: T) => void;

  // Leading cell (e.g. group painter pill)
  renderLeadingCell?: (row: T) => ReactNode;

  // Toolbar above the table
  headerActions?: ReactNode;

  // Suppress text selection during drag
  noSelect?: boolean;

  // Row index label; defaults to displayIndex + 1
  getRowLabel?: (row: T, displayIndex: number) => string;

  // CRUD
  renderRowActions?: (row: T) => ReactNode;
  footer?: ReactNode;

  emptyMessage?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROW_HEIGHT = 33;
const DEFAULT_COL_WIDTH = 100;
const LEADING_COL_WIDTH = 28;
const INDEX_COL_WIDTH = 32;
const ACTIONS_COL_WIDTH = 64;

// ─── SortIcon ─────────────────────────────────────────────────────────────────

function SortIcon({ sortDir }: { sortDir: SortDir | null | undefined }) {
  if (!sortDir) return <ChevronsUpDown size={11} className="opacity-30" />;
  return sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />;
}

// ─── VirtualTable ─────────────────────────────────────────────────────────────

export function VirtualTable<T>({
  rows,
  columns,
  getRowKey,
  getRowClass,
  getCellClass,
  onHeaderCellClick,
  onRowClick,
  renderLeadingCell,
  headerActions,
  noSelect,
  getRowLabel,
  renderRowActions,
  footer,
  emptyMessage = "無資料",
}: VirtualTableProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0);

  const hasLeading = !!renderLeadingCell;
  const hasActions = !!renderRowActions;
  const totalColSpan =
    (hasLeading ? 1 : 0) + 1 + columns.length + (hasActions ? 1 : 0) + 1;

  const wrapperStyle = useMemo<CSSProperties | undefined>(
    () => (noSelect ? { userSelect: "none" } : undefined),
    [noSelect],
  );

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {headerActions && (
        <div className="flex justify-end">{headerActions}</div>
      )}

      <div ref={scrollRef} className={t.wrapper} style={wrapperStyle}>
        <table className={t.table}>
          <colgroup>
            {hasLeading && <col style={{ width: LEADING_COL_WIDTH }} />}
            <col style={{ width: INDEX_COL_WIDTH }} />
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width ?? DEFAULT_COL_WIDTH }} />
            ))}
            {hasActions && <col style={{ width: ACTIONS_COL_WIDTH }} />}
            <col />
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr className={t.headerRow}>
              {hasLeading && <th className="px-1 py-0" />}
              <th className={t.headerIndexCell} />
              {columns.map((col) => {
                const isSortable = !!col.onSort;
                const isInteractive = isSortable || !!onHeaderCellClick;
                const thClass =
                  col.headerClass ??
                  (isInteractive ? t.headerCellInteractive : t.headerCell);

                return (
                  <th
                    key={col.key}
                    className={thClass}
                    onClick={() => {
                      col.onSort?.();
                      onHeaderCellClick?.(col.key);
                    }}
                  >
                    {isSortable ? (
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon sortDir={col.sortDir} />
                      </div>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
              {hasActions && <th className={`${t.headerCell} w-16`} />}
              <th className={t.headerCell} />
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={totalColSpan}
                  className="px-3 py-8 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {paddingTop > 0 && (
              <tr aria-hidden>
                <td colSpan={totalColSpan} style={{ height: paddingTop, padding: 0 }} />
              </tr>
            )}

            {virtualItems.map((vRow) => {
              const row = rows[vRow.index];
              const rowClass =
                getRowClass?.(row) ?? (onRowClick ? t.row : t.rowStatic);

              return (
                <tr
                  key={getRowKey(row)}
                  ref={virtualizer.measureElement}
                  data-index={vRow.index}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={rowClass}
                >
                  {hasLeading && (
                    <td className="px-1 py-0 text-center">
                      {renderLeadingCell!(row)}
                    </td>
                  )}

                  <td className={t.indexCell}>
                    {getRowLabel
                      ? getRowLabel(row, vRow.index)
                      : String(vRow.index + 1)}
                  </td>

                  {columns.map((col) => {
                    const cellClass = getCellClass?.(row, col.key) ?? t.cell;
                    return (
                      <td key={col.key} className={cellClass}>
                        {col.renderCell
                          ? col.renderCell(row)
                          : String(
                              (row as Record<string, unknown>)[col.key] ?? "",
                            )}
                      </td>
                    );
                  })}

                  {hasActions && (
                    <td className="px-2 py-1 whitespace-nowrap">
                      <div className="flex gap-2 justify-end">
                        {renderRowActions!(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {paddingBottom > 0 && (
              <tr aria-hidden>
                <td colSpan={totalColSpan} style={{ height: paddingBottom, padding: 0 }} />
              </tr>
            )}

            {footer && (
              <tr>
                <td colSpan={totalColSpan}>{footer}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
