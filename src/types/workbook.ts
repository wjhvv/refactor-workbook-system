export interface Sheet {
  id: string;
  name: string;
}

export interface Workbook {
  id: string;
  name: string;
  sheets: Sheet[];
}
