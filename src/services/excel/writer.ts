import ExcelJS from "exceljs";
import type { ParsedRow } from "../../types/excel";
import type { ColumnDef } from "../../types/displayTable";

/** A single worksheet to be written into the output Excel file. */
export interface WorksheetData {
  name: string;
  columns: ColumnDef[];
  preHeaderRows: ParsedRow[];
  headerRow: ParsedRow;
  dataRows: ParsedRow[];
}

export async function downloadWorkbook(
  worksheets: WorksheetData[],
  filename: string,
): Promise<void> {
  const wb = new ExcelJS.Workbook();

  for (const ws of worksheets) {
    const sheet = wb.addWorksheet(ws.name.slice(0, 31));

    for (const row of ws.preHeaderRows) {
      sheet.addRow(Object.values(row.cells).map((c) => c.value));
    }

    sheet.addRow(ws.columns.map((col) => col.label));

    for (const row of ws.dataRows) {
      sheet.addRow(ws.columns.map((col) => row.cells[col.key]?.value ?? null));
    }
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
