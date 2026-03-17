import { useMemo } from "react";
import { RawSheetView } from "./RawSheetView";
import { SplitPanel } from "../panel";
import { useRowGroupPainter } from "../../hooks/useRowGroupPainter";
import { mergeTableFeatures } from "../../utils/mergeTableFeatures";
import { tableStyles } from "./table.styles";
import type { TableFeatureProps } from "../../types/tableFeature";
import type { SheetHeaderState } from "../../hooks/useSheetHeader";
import type { SheetSplitState } from "../../hooks/useSheetSplit";
import type { ParsedSheet } from "../../types/excel";

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

  const dataRowIndices = useMemo(() => dataRows.map((r) => r.index), [dataRows]);

  const painter = useRowGroupPainter({
    rowGroupMap: displayRowGroupMap,
    maxGroup,
    onPaintRows: paintRows,
    dataRowIndices,
    readOnly: isColumnMode,
  });

  // ── Feature: row group painting ───────────────────────────────────────────
  const painterFeature = useMemo(
    (): Partial<TableFeatureProps> => ({
      getRowClass: painter.getRowClass,
      getCellClass: painter.getCellClass,
      renderLeadingCell: splitMode !== null ? painter.renderLeadingCell : undefined,
      noSelect: isRowMode && !!painter.isDraggingRef.current,
    }),
    [painter, splitMode, isRowMode],
  );

  // ── Feature: split column selection ──────────────────────────────────────
  const splitColFeature = useMemo((): Partial<TableFeatureProps> => {
    if (!isColumnMode) return {};
    return {
      getHeaderCellClass: (colKey) =>
        colKey === splitColKey
          ? tableStyles.rawCellSplitSelected
          : tableStyles.rawCellSelectedInteractive,
      onHeaderCellClick: (colKey) =>
        setSplitColKey(splitColKey === colKey ? null : colKey),
    };
  }, [isColumnMode, splitColKey, setSplitColKey]);

  // ── Feature: header row toolbar ───────────────────────────────────────────
  const headerFeature = useMemo(
    (): Partial<TableFeatureProps> => ({
      headerActions:
        headerRowIndex !== null ? (
          <button
            onClick={clearHeaderRow}
            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            重新設定表頭
          </button>
        ) : undefined,
    }),
    [headerRowIndex, clearHeaderRow],
  );

  const tableProps = mergeTableFeatures(painterFeature, splitColFeature, headerFeature);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <RawSheetView
        {...tableProps}
        sheet={sheet}
        headerRowIndex={headerRowIndex}
        onRowClick={headerRowIndex === null ? setHeaderRow : undefined}
      />

      {isRowMode && painter.dropdownEl}

      {headerRowIndex !== null && columns.length > 0 && (
        <SplitPanel splitMode={splitMode} onSplitModeChange={setSplitMode} />
      )}
    </div>
  );
}
