import { useEffect, useState } from "react";
import { AttributeGroupsApi } from "@/api/attributeGroups";
import type AttributeGroup from "@/interfaces/attributeGroup.interface";
import type { AttributeGroupFilters } from "@/interfaces/attributeGroup.filters.interface";

export function useAttributeGroups(
  page: number,
  limit: number,
  filters?: AttributeGroupFilters
) {
  const [groups, setGroups] = useState<AttributeGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await AttributeGroupsApi.getAll(page, limit, filters || {});
      setGroups(response.data as AttributeGroup[]);
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
    fetchGroups();
  }, [page, limit, filters]);

  return [groups, loading, error, totalPages, fetchGroups] as const;
}
