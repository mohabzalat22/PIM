import { useState, useEffect } from "react";
import { StoreViewsApi } from "@/api/storeView";
import type Filter from "@/interfaces/storeView/filters.iterface";

export function useStoreViews <T>(page: number, limit: number, filters?: Filter) {
  const [storeViews, setStoreViews] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchStoreViews = async () => {
    setLoading(true);
    try {
      const response = await StoreViewsApi.getAll(page, limit, filters);
      setStoreViews(response.data as T[]);
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
    fetchStoreViews();
  }, [page, limit, filters]);

  return [storeViews, loading, error, totalPages, fetchStoreViews] as const;
}
