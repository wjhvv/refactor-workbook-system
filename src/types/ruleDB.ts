/** Normalised row shape shared by RuleDataTable and RuleRowDialog */
export interface RuleRowData {
  key: string;
  category: string;
  lead: string;
}

export interface HeaderField {
  name: string;
  aliases: string[];
}

export interface PartNumberRule {
  partNumber: string;
  category: string;
  lead: string;
}

export interface DescriptionRule {
  description: string;
  category: string;
  lead: string;
}

import type { ParsedSheet } from "./excel";

export interface RemovedRow {
  sheet: "partnumber" | "description";
  rowIndex: number;
  value: string;
  reason: string;
}

export interface RuleDatabase {
  headerFields: HeaderField[];
  partNumbers: PartNumberRule[];
  descriptions: DescriptionRule[];
  partNumberSheet: ParsedSheet;
  descriptionSheet: ParsedSheet;
  removedRows: RemovedRow[];
}
