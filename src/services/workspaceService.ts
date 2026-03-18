import type { Workspace } from "../types/workspace";

// ─── Interface ────────────────────────────────────────────────────────────────
// Async throughout so swapping in an API implementation requires no call-site changes.

type WorkspacePatch = Partial<Pick<Workspace, "name" | "activeStep" | "completedSteps">>;

export interface IWorkspaceService {
  list(): Promise<Workspace[]>;
  create(name: string): Promise<Workspace>;
  update(id: string, patch: WorkspacePatch): Promise<Workspace>;
  remove(id: string): Promise<void>;
}

// ─── localStorage implementation ──────────────────────────────────────────────

const STORAGE_KEY = "rfq_workspaces";

function readStorage(): Workspace[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeStorage(workspaces: Workspace[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
}

export const localWorkspaceService: IWorkspaceService = {
  async list() {
    return readStorage();
  },

  async create(name) {
    const workspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeStep: 0,
      completedSteps: [],
    };
    writeStorage([...readStorage(), workspace]);
    return workspace;
  },

  async update(id, patch) {
    const all = readStorage();
    const idx = all.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error(`Workspace ${id} not found`);
    const updated = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    writeStorage(all);
    return updated;
  },

  async remove(id) {
    writeStorage(readStorage().filter((w) => w.id !== id));
  },
};
