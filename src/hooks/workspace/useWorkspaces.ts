import { useState, useEffect, useCallback } from "react";
import type { Workspace } from "../../types/workspace";
import { localWorkspaceService as service } from "../../services/workspaceService";

export function generateName(existing: Workspace[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = existing.filter((w) =>
    w.createdAt.startsWith(today),
  ).length;
  return `${today}_${todayCount + 1}`;
}

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    service.list().then(setWorkspaces);
  }, []);

  const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? null;

  const createWorkspace = useCallback(async (name?: string) => {
    const resolvedName = name?.trim() || generateName(workspaces);
    const ws = await service.create(resolvedName);
    setWorkspaces((prev) => [...prev, ws]);
    setActiveId(ws.id);
  }, [workspaces]);

  const updateWorkspace = useCallback(
    async (id: string, patch: Parameters<typeof service.update>[1]) => {
      const updated = await service.update(id, patch);
      setWorkspaces((prev) => prev.map((w) => (w.id === id ? updated : w)));
    },
    [],
  );

  const removeWorkspace = useCallback(
    async (id: string) => {
      await service.remove(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId],
  );

  return {
    workspaces,
    activeId,
    activeWorkspace,
    setActiveId,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
  };
}
