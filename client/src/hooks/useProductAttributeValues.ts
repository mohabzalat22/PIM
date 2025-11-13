import { ProductAttibuteValuesApi } from "@/api/productAttributeValues";
import type Filters from "@/interfaces/productAttributes/filters.interface";
import type ProductAttributeValue from "@/interfaces/productAttributes/productAttributevalue.interface";
import { useState, useEffect } from "react";

export function useProductAttributeValues(
  page: number,
  limit: number,
  filters: Filters
) {
  const [productAttributeValues, setProductAttributeValues] = useState<
    ProductAttributeValue[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProductAttributeValues = async () => {
    setLoading(true);
    try {
      const response = await ProductAttibuteValuesApi.getAll(
        page,
        limit,
        filters
      );
      setProductAttributeValues(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAttributeValues();
  }, [page, limit, filters]);

  return [productAttributeValues, loading, error] as const;
}
