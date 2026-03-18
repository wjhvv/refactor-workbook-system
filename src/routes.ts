import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Layers, ClipboardList, Database } from "lucide-react";
import { WorkbookSplitPage } from "./pages/WorkbookSplitPage";
import { RFQPage } from "./pages/RFQPage";
import { RuleDBPage } from "./pages/RuleDBPage";

export interface Route {
  label: string;
  path: string;
  component: ComponentType;
  icon?: LucideIcon;
}

export const routes: Route[] = [
  { label: "Workbook Split", path: "/workbook-split", component: WorkbookSplitPage, icon: Layers },
  { label: "RFQ",            path: "/rfq",            component: RFQPage,           icon: ClipboardList },
  { label: "Rule Database",  path: "/rule-database",  component: RuleDBPage,        icon: Database },
];
