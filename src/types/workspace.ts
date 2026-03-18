export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  activeStep: number;
  completedSteps: number[];
}
