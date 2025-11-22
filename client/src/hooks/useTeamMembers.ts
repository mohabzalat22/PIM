import { useState, useEffect } from "react";
import type TeamMember from "@/interfaces/teamMember.interface";
import { TeamMemberApi } from "@/api/teamMembers";
import type Filters from "@/interfaces/teamMember/filters.interface";

export function useTeamMembers(page: number, limit: number, filters?: Filters) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await TeamMemberApi.getAll(page, limit, filters);
      setTeamMembers(response.data);
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
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filters]);

  return [teamMembers, loading, error, totalPages, fetchTeamMembers] as const;
}
