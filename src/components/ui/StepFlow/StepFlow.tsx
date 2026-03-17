import { useState } from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { stepStyles } from "./stepFlow.styles";

export interface StepConfig {
  label: string;
  content: (onComplete: () => void) => ReactNode;
}

type StepStatus = "completed" | "active" | "locked";

// ─── StepIndicator ────────────────────────────────────────────────────────────

interface StepIndicatorProps {
  steps: StepConfig[];
  activeStep: number;
  completedSteps: Set<number>;
  onStepClick: (index: number) => void;
}

function StepIndicator({ steps, activeStep, completedSteps, onStepClick }: StepIndicatorProps) {
  function getStatus(index: number): StepStatus {
    if (completedSteps.has(index)) return "completed";
    if (index === activeStep) return "active";
    return "locked";
  }

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const status = getStatus(index);
        const isClickable = status === "completed";

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className="flex flex-col items-center gap-1.5 group disabled:cursor-default"
            >
              <div className={`${stepStyles.circle} ${
                status === "completed" ? stepStyles.circleCompleted :
                status === "active"    ? stepStyles.circleActive :
                                        stepStyles.circleLocked
              }`}>
                {status === "completed" ? <Check size={14} strokeWidth={2.5} /> : index + 1}
              </div>
              <span className={`${stepStyles.label} ${
                status === "locked" ? stepStyles.labelLocked : stepStyles.labelActive
              }`}>
                {step.label}
              </span>
            </button>

            {index < steps.length - 1 && (
              <div className={`${stepStyles.connector} ${
                completedSteps.has(index) ? stepStyles.connectorCompleted : stepStyles.connectorPending
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── StepFlow ─────────────────────────────────────────────────────────────────

interface StepFlowProps {
  steps: StepConfig[];
  initialStep?: number;
  initialCompletedSteps?: number[];
  onStateChange?: (activeStep: number, completedSteps: number[]) => void;
}

export function StepFlow({
  steps,
  initialStep = 0,
  initialCompletedSteps = [],
  onStateChange,
}: StepFlowProps) {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(initialCompletedSteps),
  );

  function notify(next: { activeStep: number; completedSteps: Set<number> }) {
    onStateChange?.(next.activeStep, [...next.completedSteps]);
  }

  function handleComplete() {
    const nextCompleted = new Set([...completedSteps, activeStep]);
    const nextStep = activeStep < steps.length - 1 ? activeStep + 1 : activeStep;
    setCompletedSteps(nextCompleted);
    setActiveStep(nextStep);
    notify({ activeStep: nextStep, completedSteps: nextCompleted });
  }

  function handleStepClick(index: number) {
    const nextCompleted = new Set(completedSteps);
    for (let i = index; i < steps.length; i++) nextCompleted.delete(i);
    setCompletedSteps(nextCompleted);
    setActiveStep(index);
    notify({ activeStep: index, completedSteps: nextCompleted });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      <StepIndicator
        steps={steps}
        activeStep={activeStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />
      <div className="flex flex-col flex-1 min-h-0">
        {steps[activeStep]?.content(handleComplete)}
      </div>
    </div>
  );
}
