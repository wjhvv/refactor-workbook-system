import type { ParsedSheet } from "../../types/excel";
import type { SplitTable } from "../../types/displayTable";

export function groupByColumn(
  sheet: ParsedSheet,
  headerRowIndex: number,
  colKey: string,
): SplitTable[] {
  const preHeaderRows = sheet.rows.filter((r) => r.index < headerRowIndex);
  const headerRow = sheet.rows.find((r) => r.index === headerRowIndex);
  if (!headerRow) return [];

  const dataRows = sheet.rows.filter((r) => r.index > headerRowIndex);

  const groupMap = new Map<string, typeof dataRows>();
  for (const row of dataRows) {
    const value = String(row.cells[colKey]?.value ?? "（空白）");
    if (!groupMap.has(value)) groupMap.set(value, []);
    groupMap.get(value)!.push(row);
  }

  return Array.from(groupMap.entries()).map(([name, rows]) => ({
    name,
    preHeaderRows,
    headerRow,
    dataRows: rows,
  }));
}
