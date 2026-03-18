import { ArrowRight } from "lucide-react";
import { stepPlaceholderStyles as s } from "./stepFlow.styles";
import { WideButton } from "../WideButton";

export function StepPlaceholder({ label, onComplete }: { label: string; onComplete: () => void }) {
  return (
    <div className={s.container}>
      <p className={s.label}>{label}（待實作）</p>
      <WideButton icon={ArrowRight} label="完成" onClick={onComplete} />
    </div>
  );
}
