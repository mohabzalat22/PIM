import { useState, useEffect } from "react";
import type Workspace from "@/interfaces/workspace.interface";
import { WorkspaceApi } from "@/api/workspaces";
import type Filters from "@/interfaces/workspace/filters.interface";

export function useWorkspaces(page: number, limit: number, filters?: Filters) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await WorkspaceApi.getAll(page, limit, filters);
      setWorkspaces(response.data);
      if (response.meta?.totalPages) {
        setTotalPages(response.meta.totalPages);
      } else if (response.meta?.total) {
        setTotalPages(Math.ceil(response.meta.total / limit));
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  return [workspaces, loading, error, totalPages, fetchWorkspaces] as const;
}