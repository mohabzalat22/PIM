import { useState, useEffect } from "react";
import type Team from "@/interfaces/team.interface";
import { TeamApi } from "@/api/teams";
import type Filters from "@/interfaces/team/filters.interface";

export function useTeams(page: number, limit: number, filters?: Filters) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const response = await TeamApi.getAll(page, limit, filters);
      setTeams(response.data);
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
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  return [teams, loading, error, totalPages, fetchTeams] as const;
}
