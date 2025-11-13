import { useState, useEffect } from "react";
import type StoreViewInterface from "@/interfaces/storeView.interface";
import { StoreViewsApi } from "@/api/storeView";

export function useStoreViews(page: number, limit: number) {
  const [storeViews, setStoreViews] = useState<StoreViewInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await StoreViewsApi.getAll(page, limit);
      setStoreViews(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeViews, limit]);

  return [storeViews, loading, error] as const;
}
