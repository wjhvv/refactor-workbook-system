import type { LoadedWorkbook } from "../../types/workbook";
import type { ColumnDef, SplitTable } from "../../types/displayTable";
import type { ParsedRow } from "../../types/excel";
import type { WorksheetData } from "./writer";

interface SheetTableSnapshot {
  headerRowIndex: number | null;
  columns: ColumnDef[];
  dataRows: ParsedRow[];
}

interface SheetSplitSnapshot {
  splitTables: SplitTable[];
}

/**
 * Build the list of worksheets to export for one workbook.
 *
 * Naming:
 *   - Split sheet  → `sheetName_groupName` per group
 *   - Intact sheet → `sheetName`
 *   - Sheet without header → skipped
 */
export function buildDownloadWorksheets(
  lw: LoadedWorkbook,
  tableStateMap: Record<string, SheetTableSnapshot>,
  splitStateMap: Record<string, SheetSplitSnapshot>,
): WorksheetData[] {
  const worksheets: WorksheetData[] = [];

  for (const sheet of lw.parsed.sheets) {
    const tableState = tableStateMap[sheet.name];
    const splitState = splitStateMap[sheet.name];

    if (!tableState || tableState.headerRowIndex === null || tableState.columns.length === 0) {
      continue;
    }

    const { headerRowIndex, columns, dataRows } = tableState;
    const preHeaderRows = sheet.rows.filter((r) => r.index < headerRowIndex);
    const headerRow = sheet.rows.find((r) => r.index === headerRowIndex)!;

    if (splitState && splitState.splitTables.length > 0) {
      for (const group of splitState.splitTables) {
        worksheets.push({
          name: `${sheet.name}_${group.name}`,
          columns,
          preHeaderRows: group.preHeaderRows,
          headerRow: group.headerRow,
          dataRows: group.dataRows,
        });
      }
    } else {
      worksheets.push({ name: sheet.name, columns, preHeaderRows, headerRow, dataRows });
    }
  }

  return worksheets;
}
