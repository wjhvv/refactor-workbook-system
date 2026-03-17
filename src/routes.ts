import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Layers } from "lucide-react";
import { WorkbookSplitPage } from "./pages/WorkbookSplitPage";

export interface Route {
  label: string;
  path: string;
  component: ComponentType;
  icon?: LucideIcon;
}

export const routes: Route[] = [
  { label: "Workbook Split", path: "/workbook-split", component: WorkbookSplitPage, icon: Layers },
];
