import type { ParsedSheet, ParsedRow } from "../../types/excel";
import type { ColumnDef, HeaderDetectionResult } from "../../types/displayTable";
import { HEADER_DETECTION_STATUS } from "../../types/displayTable";
import { cellValueToLabel } from "../../utils/text";

/** Excel 位址（如 "B3"）末尾的數字就是 row index */
function extractRowIndex(address: string): number | null {
  const match = address.match(/\d+$/);
  return match ? parseInt(match[0], 10) : null;
}

/** 把 header 列的每個 cell 轉成 ColumnDef */
function buildColumns(sheet: ParsedSheet, headerRow: ParsedRow): ColumnDef[] {
  return Object.entries(headerRow.cells)
    .filter(([, cell]) => !cell.isMergedChild)
    .map(([colKey, cell]) => {
      const colDef = sheet.columns.find((c) => String(c.index) === colKey);
      return {
        key: colKey,
        label: cellValueToLabel(cell.value, colKey),
        width: colDef?.width,
        hidden: colDef?.hidden ?? false,
      };
    });
}

export function detectHeaderBySelection(
  sheet: ParsedSheet,
  selectedAddresses: string[],
): HeaderDetectionResult {
  const rowIndexes = selectedAddresses.map(extractRowIndex);
  const uniqueRows = [...new Set(rowIndexes.filter((r) => r !== null))];

  if (uniqueRows.length !== 1)
    return { status: HEADER_DETECTION_STATUS.NotFound };

  const headerRowIndex = uniqueRows[0]!;
  const headerRow = sheet.rows.find((r) => r.index === headerRowIndex);

  return {
    status: HEADER_DETECTION_STATUS.Found,
    headerRowIndex,
    columns: headerRow ? buildColumns(sheet, headerRow) : [],
  };
}
