import type { ParsedWorkbook } from "./excel";

export interface Sheet {
  id: string;
  name: string;
}

export interface Workbook {
  id: string;
  name: string;
  sheets: Sheet[];
}

export interface LoadedWorkbook {
  descriptor: Workbook;
  parsed: ParsedWorkbook;
}
