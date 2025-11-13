import { useEffect, useState } from "react";
import { ProductsApi } from "@/api/products";
import type Product from "@/interfaces/product.interface";
import type Filters from "@/interfaces/products.filters.interface";

export function useProducts(page: number, limit: number, filters?: Filters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductsApi.getAll(page, limit, filters);
      setProducts(response.data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, filters]);

  return [products, loading, error] as const;
}
