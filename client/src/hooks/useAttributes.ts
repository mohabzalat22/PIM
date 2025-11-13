import { AttributesApi } from "@/api/attributes";
import type AttributeInterface from "@/interfaces/attribute.interface";
import { useEffect, useState } from "react";
import type { Filters } from "@/interfaces/attributes.filters.interface";

export function useAttributes(page: number, limit: number, filters: Filters) {
  const [attributes, setAttributes] = useState<AttributeInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await AttributesApi.getAll(page, limit, filters);
      setAttributes(response.data);
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

  return [attributes, loading, error] as const;
}
