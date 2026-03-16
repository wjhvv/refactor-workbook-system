import ExcelJS from "exceljs";

export function resolveValue(cell: ExcelJS.Cell): string | number | null {
  if (cell.type === ExcelJS.ValueType.Formula) {
    return (cell.result as string | number) ?? null;
  }
  if (cell.value === null || cell.value === undefined) return null;
  return cell.value as string | number;
}

function countSpan(
  getNext: (offset: number) => ExcelJS.Cell,
  masterAddress: string,
): number {
  let span = 1;
  while (true) {
    const next = getNext(span);
    if (next.isMerged && next.master?.address === masterAddress) {
      span++;
    } else break;
  }
  return span;
}

export function resolveMergeSpan(
  worksheet: ExcelJS.Worksheet,
  rowIndex: number,
  colIndex: number,
): { rowSpan: number; colSpan: number } {
  const masterAddress = worksheet.getCell(rowIndex, colIndex).address;

  return {
    colSpan: countSpan(
      (offset) => worksheet.getCell(rowIndex, colIndex + offset),
      masterAddress,
    ),
    rowSpan: countSpan(
      (offset) => worksheet.getCell(rowIndex + offset, colIndex),
      masterAddress,
    ),
  };
}
