import { AttributesApi } from "@/api/attributes";
import type AttributeInterface from "@/interfaces/attribute.interface";
import { useEffect, useState } from "react";

export function useAttributes() {
  const [attributes, setAttributes] = useState<AttributeInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await AttributesApi.getAll();
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
  }, []);

  return [attributes, loading, error] as const;
}
