import type { ParsedSheet } from "../../types/excel";
import type { SplitTable } from "../../types/displayTable";

export function groupByRow(
  sheet: ParsedSheet,
  headerRowIndex: number,
  rowGroupMap: Record<number, number>,
): SplitTable[] {
  const preHeaderRows = sheet.rows.filter((r) => r.index < headerRowIndex);
  const headerRow = sheet.rows.find((r) => r.index === headerRowIndex);
  if (!headerRow) return [];

  const dataRows = sheet.rows.filter((r) => r.index > headerRowIndex);
  const groupNums = [...new Set(Object.values(rowGroupMap))].sort(
    (a, b) => a - b,
  );

  return groupNums
    .map((groupNum) => ({
      name: String(groupNum),
      preHeaderRows,
      headerRow,
      dataRows: dataRows.filter((r) => rowGroupMap[r.index] === groupNum),
    }))
    .filter((g) => g.dataRows.length > 0);
}
