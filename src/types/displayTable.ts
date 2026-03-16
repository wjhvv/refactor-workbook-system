import type { ParsedRow } from "./excel";

export interface ColumnDef {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
}

export interface SplitTable {
  name: string;
  preHeaderRows: ParsedRow[];
  headerRow: ParsedRow;
  dataRows: ParsedRow[];
}

export const HEADER_DETECTION_STATUS = {
  Found: "found",
  NotFound: "not_found",
} as const;

type HeaderDetectionStatus =
  (typeof HEADER_DETECTION_STATUS)[keyof typeof HEADER_DETECTION_STATUS];

export type HeaderDetectionResult =
  | { status: Extract<HeaderDetectionStatus, "found">; headerRowIndex: number; columns: ColumnDef[] }
  | { status: Extract<HeaderDetectionStatus, "not_found"> };
