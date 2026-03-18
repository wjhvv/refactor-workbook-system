import { ArrowRight } from "lucide-react";
import { WorkbookUploadView } from "../../components/workbook/WorkbookUploadView";
import { WideButton } from "../../components/ui/WideButton";

export function CategorizationStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-3">
      <WorkbookUploadView />
      <div className="flex justify-end">
        <WideButton icon={ArrowRight} label="完成此步驟" onClick={onComplete} />
      </div>
    </div>
  );
}
