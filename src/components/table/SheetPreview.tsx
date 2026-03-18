import { useMemo } from "react";
import { VirtualTable } from "./VirtualTable";
import type { VirtualTableColumn } from "./VirtualTable";
import { tableStyles as t } from "./table.styles";
import type { ParsedSheet, ParsedRow, ParsedColumn } from "../../types/excel";

const EXCEL_CHAR_TO_PX = 7;
const DEFAULT_COL_WIDTH = 100;

function excelColToPixels(col: ParsedColumn | undefined): number {
  if (col?.width != null) return Math.max(60, Math.round(col.width * EXCEL_CHAR_TO_PX));
  return DEFAULT_COL_WIDTH;
}

function buildColKeys(sheet: ParsedSheet): string[] {
  let colCount = sheet.columns.length;
  for (const row of sheet.rows) {
    const n = Object.keys(row.cells).length;
    if (n > colCount) colCount = n;
  }
  return Array.from({ length: colCount }, (_, i) => String(i + 1));
}

export function SheetPreview({ sheet }: { sheet: ParsedSheet }) {
  const colKeys = useMemo(() => buildColKeys(sheet), [sheet]);

  const columns = useMemo((): VirtualTableColumn<ParsedRow>[] =>
    colKeys.map((key, i) => ({
      key,
      label: key,
      width: excelColToPixels(sheet.columns[i]),
      renderCell: (row) => {
        const value = row.cells[key]?.value;
        return value != null ? String(value) : "";
      },
    })),
    [colKeys, sheet.columns],
  );

  return (
    <VirtualTable<ParsedRow>
      rows={sheet.rows}
      columns={columns}
      getRowKey={(row) => row.index}
      getCellClass={(row, key) =>
        row.cells[key]?.value == null ? t.cellEmpty : undefined
      }
      emptyMessage="此工作表沒有資料"
    />
  );
}
