import { useState } from "react";
import { Database, Download } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { EmptyState } from "../components/ui/EmptyState";
import { UploadZone } from "../components/ui/UploadZone";
import { TabBar } from "../components/ui/TabBar";
import { WideButton } from "../components/ui/WideButton";
import { useRuleDB } from "../hooks/ruleDB/useRuleDB";
import { HeaderEditor } from "./ruleDB/HeaderEditor";
import { RuleDataTable } from "./ruleDB/RuleDataTable";
import { RemovedRowsBanner } from "./ruleDB/RemovedRowsBanner";
import { RuleDBFileBar } from "./ruleDB/RuleDBFileBar";
import { downloadExcel } from "../services/excel/workbookExport";
import type { TabItem } from "../components/ui/TabBar";
import type { RuleRowData } from "../types/ruleDB";

const TABS: TabItem[] = [
  { id: "header",      label: "Header" },
  { id: "partnumber",  label: "Part Number" },
  { id: "description", label: "Description" },
];

export function RuleDBPage() {
  const {
    ruleDB,
    fileName,
    fileSize,
    sheetCount,
    error,
    loading,
    loadFile,
    clearRuleDB,
    addHeaderField,
    addAlias,
    removeAlias,
    addPartNumber,
    updatePartNumber,
    deletePartNumber,
    addDescription,
    updateDescription,
    deleteDescription,
  } = useRuleDB();

  const [activeTab, setActiveTab] = useState("header");
  const [removedDismissed, setRemovedDismissed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  function handleUpload(file: File) {
    setRemovedDismissed(false);
    loadFile(file);
  }

  async function handleDownload() {
    if (!ruleDB) return;
    setDownloading(true);
    try {
      const maxAliases = Math.max(0, ...ruleDB.headerFields.map((f) => f.aliases.length));
      await downloadExcel([
        { name: "header", rows: [
            ruleDB.headerFields.map((f) => f.name),
            ...Array.from({ length: maxAliases }, (_, i) =>
              ruleDB.headerFields.map((f) => f.aliases[i] ?? "")),
        ]},
        { name: "partnumber", rows: [
            ["partnumber", "category", "lead"],
            ...ruleDB.partNumbers.map((r) => [r.partNumber, r.category, r.lead]),
        ]},
        { name: "description", rows: [
            ["description", "category", "lead"],
            ...ruleDB.descriptions.map((r) => [r.description, r.category, r.lead]),
        ]},
      ], "rule_database.xlsx");
    } finally {
      setDownloading(false);
    }
  }

  const partNumberRows: RuleRowData[] =
    ruleDB?.partNumbers.map((r) => ({
      key: r.partNumber,
      category: r.category,
      lead: r.lead,
    })) ?? [];

  const descriptionRows: RuleRowData[] =
    ruleDB?.descriptions.map((r) => ({
      key: r.description,
      category: r.category,
      lead: r.lead,
    })) ?? [];

  const showRemovedBanner =
    !removedDismissed && !!ruleDB && ruleDB.removedRows.length > 0;

  return (
    <PageLayout
      title="Rule Database"
      icon={Database}
      description="上傳包含 header、partnumber、description 三個工作表的 Excel 檔案"
    >
      {loading ? (
        <EmptyState centered>
          <p className="text-sm text-gray-400">解析中...</p>
        </EmptyState>
      ) : !ruleDB ? (
        <EmptyState centered title={error ?? undefined}>
          <UploadZone
            onUpload={(files) => handleUpload(files[0])}
            accept=".xlsx,.xls"
            hint="需包含 header、partnumber、description 工作表"
          />
        </EmptyState>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 gap-4">
          <RuleDBFileBar
            fileName={fileName!}
            fileSize={fileSize!}
            sheetCount={sheetCount!}
            onReplace={handleUpload}
            onClear={clearRuleDB}
          />

          {showRemovedBanner && (
            <RemovedRowsBanner
              rows={ruleDB.removedRows}
              onDismiss={() => setRemovedDismissed(true)}
            />
          )}

          <div className="flex items-center justify-between">
            <TabBar tabs={TABS} activeId={activeTab} onSelect={setActiveTab} />
            <WideButton
              icon={Download}
              label="下載"
              variant="outline"
              disabled={downloading}
              onClick={handleDownload}
            />
          </div>

          <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            {activeTab === "header" && (
              <HeaderEditor
                fields={ruleDB.headerFields}
                onAddField={addHeaderField}
                onAddAlias={addAlias}
                onRemoveAlias={removeAlias}
              />
            )}
            {activeTab === "partnumber" && (
              <RuleDataTable
                keyLabel="Part Number"
                rows={partNumberRows}
                onAdd={(d) =>
                  addPartNumber({ partNumber: d.key, category: d.category, lead: d.lead })
                }
                onUpdate={(i, d) =>
                  updatePartNumber(i, { partNumber: d.key, category: d.category, lead: d.lead })
                }
                onDelete={deletePartNumber}
              />
            )}
            {activeTab === "description" && (
              <RuleDataTable
                keyLabel="Description"
                rows={descriptionRows}
                onAdd={(d) =>
                  addDescription({ description: d.key, category: d.category, lead: d.lead })
                }
                onUpdate={(i, d) =>
                  updateDescription(i, { description: d.key, category: d.category, lead: d.lead })
                }
                onDelete={deleteDescription}
              />
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
