import { useState, useEffect } from "react";
import type WorkspaceMember from "@/interfaces/workspaceMember.interface";
import { WorkspaceMemberApi } from "@/api/workspaceMembers";
import type Filters from "@/interfaces/workspaceMember/filters.interface";

export function useWorkspaceMembers(page: number, limit: number, filters?: Filters) {
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchWorkspaceMembers = async () => {
    setLoading(true);
    try {
      const response = await WorkspaceMemberApi.getAll(page, limit, filters);
      setWorkspaceMembers(response.data);
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
    fetchWorkspaceMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  return [workspaceMembers, loading, error, totalPages, fetchWorkspaceMembers] as const;
}