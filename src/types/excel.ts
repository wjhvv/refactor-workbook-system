export interface ExcelCellMeta {
  formula?: string;
  style?: unknown;
}

// cellAddress → meta
export type CellMetaMap = Record<string, ExcelCellMeta>;

// colIndex → ParsedCell
export type ParsedCellMap = Record<string, ParsedCell>;

// sheetName → CellMetaMap
export type SheetCellMetaMap = Record<string, CellMetaMap>;

export interface ExcelModel {
  workbook: unknown;
  cellMeta: SheetCellMetaMap;
}

export interface ParsedCell {
  value: string | number | null;
  rowSpan?: number;
  colSpan?: number;
  isMergedChild?: boolean;
}

export interface ParsedRow {
  index: number;
  cells: ParsedCellMap;
  hidden: boolean;
}

export interface ParsedColumn {
  index: number;
  width?: number;
  hidden: boolean;
}

export interface ParsedSheet {
  name: string;
  columns: ParsedColumn[];
  rows: ParsedRow[];
}

export interface ParsedWorkbook {
  sheets: ParsedSheet[];
  excelModel: ExcelModel;
}
