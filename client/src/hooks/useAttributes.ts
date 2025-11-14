import { AttributesApi } from "@/api/attributes";
import { useEffect, useState } from "react";
import type { Filters } from "@/interfaces/attributes.filters.interface";

export function useAttributes<T>(page: number, limit: number, filters?: Filters) {
  const [attributes, setAttributes] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await AttributesApi.getAll(page, limit, filters);
      setAttributes(response.data as T[]);
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
    fetchAttributes();
  }, [page, limit, filters]);

  return [attributes, loading, error, totalPages, fetchAttributes] as const;
}
