import { useEffect, useState } from "react";
import { LocalesApi, type LocaleFilters } from "@/api/locale";
import type Locale from "@/interfaces/locale.interface";

export function useLocales(
  page: number,
  limit: number,
  filters?: LocaleFilters
) {
  const [locales, setLocales] = useState<Locale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchLocales = async () => {
    setLoading(true);
    try {
      const response = await LocalesApi.getAll(page, limit, filters);
      setLocales(response.data);
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
    fetchLocales();
  }, [page, limit, filters]);

  return [locales, loading, error, totalPages, fetchLocales] as const;
}
