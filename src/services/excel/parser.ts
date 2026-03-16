import ExcelJS from "exceljs";
import type {
  CellMetaMap,
  ParsedCellMap,
  SheetCellMetaMap,
  ParsedWorkbook,
  ParsedRow,
  ParsedColumn,
} from "../../types/excel";
import { resolveMergeSpan, resolveValue } from "./cellResolver";

export async function parseExcel(file: File): Promise<ParsedWorkbook> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  if (workbook.worksheets.length === 0) {
    throw new Error("Excel 檔案中找不到任何工作表");
  }

  const allCellMeta: SheetCellMetaMap = {};

  const sheets = workbook.worksheets.map((worksheet) => {
    const cellMetaMap: CellMetaMap = {};
    const rows: ParsedRow[] = [];

    const columns: ParsedColumn[] = worksheet.columns.map((col, index) => ({
      index: index + 1,
      width: typeof col.width === "number" ? col.width : undefined,
      hidden: col.hidden ?? false,
    }));

    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
      const cells: ParsedCellMap = {};

      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        const key = String(colIndex);
        const address = cell.address;
        const isMergedChild = cell.isMerged && cell.master?.address !== address;

        const formula =
          cell.type === ExcelJS.ValueType.Formula
            ? (cell.value as ExcelJS.CellFormulaValue).formula
            : undefined;

        const mergeSpan =
          !isMergedChild && cell.isMerged
            ? resolveMergeSpan(worksheet, rowIndex, colIndex)
            : undefined;

        if (formula || cell.style) {
          cellMetaMap[address] = { formula, style: cell.style };
        }

        cells[key] = {
          value: resolveValue(cell),
          isMergedChild,
          ...mergeSpan,
        };
      });

      rows.push({ index: rowIndex, cells, hidden: row.hidden ?? false });
    });

    allCellMeta[worksheet.name] = cellMetaMap;

    return { name: worksheet.name, columns, rows };
  });

  return {
    sheets,
    excelModel: { workbook, cellMeta: allCellMeta },
  };
}
