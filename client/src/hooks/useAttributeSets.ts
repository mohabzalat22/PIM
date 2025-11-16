import { useEffect, useState } from "react";
import { AttributeSetsApi } from "@/api/attributeSets";
import type AttributeSet from "@/interfaces/attributeSet.interface";
import type { AttributeSetFilters } from "@/interfaces/attributeSet.filters.interface";

export function useAttributeSets(
  page: number,
  limit: number,
  filters?: AttributeSetFilters
) {
  const [attributeSets, setAttributeSets] = useState<AttributeSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchAttributeSets = async () => {
    try {
      setLoading(true);
      const response = await AttributeSetsApi.getAll(page, limit, filters || {});
      setAttributeSets(response.data as AttributeSet[]);
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
    fetchAttributeSets();
  }, [page, limit, filters]);

  return [attributeSets, loading, error, totalPages, fetchAttributeSets] as const;
}
