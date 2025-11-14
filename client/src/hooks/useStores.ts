import { useState, useEffect } from "react";
import type StoreInterface from "@/interfaces/store.interface";
import { StoreApi } from "@/api/store";
import type Filters from "@/interfaces/store/filters.interface";

export function useStores(page: number, limit: number, filters?: Filters) {
  const [stores, setStores] = useState<StoreInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await StoreApi.getAll(page, limit, filters);
      setStores(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, limit, filters]);

  return [stores, loading, error, fetchStores] as const;
}
