import ExcelJS from "exceljs";
import JSZip from "jszip";
import type { LoadedWorkbook } from "../../types/workbook";
import type { ParsedRow } from "../../types/excel";
import type { ColumnDef, SplitTable } from "../../types/displayTable";

// ─── Internal types ───────────────────────────────────────────────────────────

type WorksheetData =
  | { name: string; rawRows: ParsedRow[] }
  | { name: string; columns: ColumnDef[]; preHeaderRows: ParsedRow[]; headerRow: ParsedRow; dataRows: ParsedRow[] };

interface SheetTableSnapshot {
  headerRowIndex: number | null;
  columns: ColumnDef[];
  dataRows: ParsedRow[];
}

interface SheetSplitSnapshot {
  splitTables: SplitTable[];
}

// ─── Build ────────────────────────────────────────────────────────────────────

/**
 * Build the list of worksheets to export for one workbook.
 *
 * Sheet naming:
 *   - Split sheet  → `sheetName_groupName` per group
 *   - Intact sheet → `sheetName`
 *   - Sheet without header → preserved as raw rows under `sheetName`
 */
function buildWorksheets(
  lw: LoadedWorkbook,
  tableStateMap: Record<string, SheetTableSnapshot>,
  splitStateMap: Record<string, SheetSplitSnapshot>,
): WorksheetData[] {
  const worksheets: WorksheetData[] = [];

  for (const sheet of lw.parsed.sheets) {
    const tableState = tableStateMap[sheet.name];
    const splitState = splitStateMap[sheet.name];

    if (!tableState || tableState.headerRowIndex === null || tableState.columns.length === 0) {
      worksheets.push({ name: sheet.name, rawRows: sheet.rows });
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

// ─── Write ────────────────────────────────────────────────────────────────────

function addWorksheetRows(sheet: ExcelJS.Worksheet, ws: WorksheetData) {
  if ("rawRows" in ws) {
    for (const row of ws.rawRows) {
      const keys = Object.keys(row.cells).sort((a, b) => Number(a) - Number(b));
      sheet.addRow(keys.map((k) => row.cells[k].value));
    }
    return;
  }

  for (const row of ws.preHeaderRows) {
    sheet.addRow(Object.values(row.cells).map((c) => c.value));
  }
  sheet.addRow(ws.columns.map((col) => col.label));
  for (const row of ws.dataRows) {
    sheet.addRow(ws.columns.map((col) => row.cells[col.key]?.value ?? null));
  }
}

async function buildWorkbookBuffer(worksheets: WorksheetData[]): Promise<ArrayBuffer> {
  const wb = new ExcelJS.Workbook();
  for (const ws of worksheets) {
    addWorksheetRows(wb.addWorksheet(ws.name.slice(0, 31)), ws);
  }
  return wb.xlsx.writeBuffer();
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Export a single workbook as a .xlsx download. */
export async function exportWorkbook(
  lw: LoadedWorkbook,
  tableStateMap: Record<string, SheetTableSnapshot>,
  splitStateMap: Record<string, SheetSplitSnapshot>,
  filename: string,
): Promise<void> {
  const worksheets = buildWorksheets(lw, tableStateMap, splitStateMap);
  if (worksheets.length === 0) return;
  const buffer = await buildWorkbookBuffer(worksheets);
  triggerBlobDownload(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    filename,
  );
}

/** Export all workbooks as a single .zip download. */
export async function exportAllAsZip(
  loadedWorkbooks: LoadedWorkbook[],
  tableStates: Record<string, Record<string, SheetTableSnapshot>>,
  splitStates: Record<string, Record<string, SheetSplitSnapshot>>,
  filename: string,
): Promise<void> {
  const zip = new JSZip();

  await Promise.all(
    loadedWorkbooks.map(async (lw) => {
      const worksheets = buildWorksheets(
        lw,
        tableStates[lw.descriptor.id] ?? {},
        splitStates[lw.descriptor.id] ?? {},
      );
      if (worksheets.length === 0) return;
      const buffer = await buildWorkbookBuffer(worksheets);
      zip.file(`${lw.descriptor.name}.xlsx`, buffer);
    }),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  triggerBlobDownload(blob, filename);
}
