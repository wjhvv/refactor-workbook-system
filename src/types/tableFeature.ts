import type { ReactNode } from "react";

export interface TableFeatureProps {
  /** Additional/override class for a body row. undefined = use default. */
  getRowClass?: (rowIndex: number) => string | undefined;
  /** Additional/override class for a body cell. undefined = use default. */
  getCellClass?: (rowIndex: number, colKey: string, value: unknown) => string | undefined;
  /** Additional/override class for a header cell. undefined = use default. */
  getHeaderCellClass?: (colKey: string) => string | undefined;
  onRowClick?: (rowIndex: number) => void;
  onHeaderCellClick?: (colKey: string) => void;
  /** Render content in the leading column cell for a body row. */
  renderLeadingCell?: (rowIndex: number) => ReactNode;
  /** Extra UI rendered in the table header toolbar. */
  headerActions?: ReactNode;
  /** Suppress text selection (e.g. during drag). */
  noSelect?: boolean;
}
