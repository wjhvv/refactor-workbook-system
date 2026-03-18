import { ClipboardList, Plus } from "lucide-react";
import { PageLayout } from "../components/layout/PageLayout";
import { StepFlow } from "../components/ui/StepFlow";
import { WideButton } from "../components/ui/WideButton";
import { EmptyState } from "../components/ui/EmptyState";
import { useWorkspaces, generateName } from "../hooks/workspace/useWorkspaces";
import { WorkspacePicker } from "../components/workspace/WorkspacePicker";
import { CreateWorkspaceDialog } from "../components/workspace/CreateWorkspaceDialog";
import { useDisclosure } from "../hooks/ui/useDisclosure";
import { CategorizationStep } from "./rfq/CategorizationStep";
import { CostStep } from "./rfq/CostStep";
import { RFQStep } from "./rfq/RFQStep";
import type { StepConfig } from "../components/ui/StepFlow";

const steps: StepConfig[] = [
  { label: "Categorization", content: (onComplete) => <CategorizationStep onComplete={onComplete} /> },
  { label: "Cost",           content: (onComplete) => <CostStep onComplete={onComplete} /> },
  { label: "RFQ",            content: (onComplete) => <RFQStep onComplete={onComplete} /> },
];

function getWorkspaceSubtitle(ws: { activeStep: number; completedSteps: number[] }) {
  if (ws.completedSteps.length === steps.length) return "已完成";
  return `步驟 ${ws.activeStep + 1} / ${steps.length}`;
}

export function RFQPage() {
  const { workspaces, activeId, activeWorkspace, setActiveId, createWorkspace, updateWorkspace, removeWorkspace } =
    useWorkspaces();
  const createDialog = useDisclosure();

  return (
    <PageLayout title="RFQ" icon={ClipboardList}>
      <div className="flex justify-end mb-4">
        <WorkspacePicker
          workspaces={workspaces}
          activeId={activeId}
          onSelect={setActiveId}
          onCreate={(name) => createWorkspace(name)}
          onRename={(id, name) => updateWorkspace(id, { name })}
          onRemove={removeWorkspace}
          getSubtitle={getWorkspaceSubtitle}
        />
      </div>
      {activeWorkspace ? (
        <StepFlow
          key={activeWorkspace.id}
          steps={steps}
          initialStep={activeWorkspace.activeStep}
          initialCompletedSteps={activeWorkspace.completedSteps}
          onStateChange={({ activeStep, completedSteps }) =>
            updateWorkspace(activeWorkspace.id, { activeStep, completedSteps })
          }
        />
      ) : (
        <EmptyState centered title="選擇或新建工作群組以開始">
          <WideButton variant="outline" icon={Plus} label="新增工作群組" onClick={createDialog.open} />
        </EmptyState>
      )}

      <CreateWorkspaceDialog
        isOpen={createDialog.isOpen}
        placeholder={generateName(workspaces)}
        onClose={createDialog.close}
        onCreate={(name) => { createWorkspace(name); createDialog.close(); }}
      />
    </PageLayout>
  );
}
