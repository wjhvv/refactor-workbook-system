export interface CellValidation {
  type: "number" | "text" | "select" | "date";
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  message?: string;
}

export interface CellStyle {
  bold?: boolean;
  backgroundColor?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
}

export interface CellDef {
  value: string | number | null;
  editable?: boolean;
  isMergedChild?: boolean;
  rowSpan?: number;
  colSpan?: number;
  validation?: CellValidation;
  style?: CellStyle;
}

export interface ColumnDef {
  key: string;
  field?: string; // 對應 HeaderCandidateGroup.field，未匹配到則 undefined
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
}

export interface RowDef {
  id: string;
  cells: Record<string, CellDef>; // key 對應 ColumnDef.key
  style?: CellStyle;
  hidden?: boolean;
}

export interface TableDef {
  columns: ColumnDef[];
  rows: RowDef[];
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface HeaderCandidateGroup {
  field: string;
  aliases: string[];
}

export const HEADER_DETECTION_STATUS = {
  Found: "found",
  Ambiguous: "ambiguous",
  NotFound: "not_found",
} as const;

type HeaderDetectionStatus =
  (typeof HEADER_DETECTION_STATUS)[keyof typeof HEADER_DETECTION_STATUS];

export type HeaderDetectionResult =
  | { status: Extract<HeaderDetectionStatus, "found">; headerRowIndex: number; columns: ColumnDef[] }
  | { status: Extract<HeaderDetectionStatus, "ambiguous">; candidates: number[] }
  | { status: Extract<HeaderDetectionStatus, "not_found"> };
