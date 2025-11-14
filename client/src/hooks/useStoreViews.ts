import { useState, useEffect } from "react";
import { StoreViewsApi } from "@/api/storeView";
import type Filter from "@/interfaces/storeView/filters.iterface";

export function useStoreViews <T>(page: number, limit: number, filters?: Filter) {
  const [storeViews, setStoreViews] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStoreViews = async () => {
    setLoading(true);
    try {
      const response = await StoreViewsApi.getAll(page, limit, filters);
      setStoreViews(response.data as T[]);
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

  return [storeViews, loading, error] as const;
}
