import { useEffect, useState } from "react";
import type Asset from "@/interfaces/asset.interface";
import type Filters from "@/interfaces/categories.filters.interface";
import { AssetService } from "@/services/asset.service";

export function useAssets(
  page: number,
  limit: number,
  filters: Filters
) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await AssetService.getAll(page, limit, filters);
      setAssets(response.data as Asset[]);
      if (response.meta?.total) {
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
    fetchAssets();
  }, [page, limit, filters]);

  return [assets, loading, error, totalPages, fetchAssets] as const;
}
