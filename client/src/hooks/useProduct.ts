import { useEffect, useState } from "react";
import { ProductsApi } from "@/api/products";
import type Product from "@/interfaces/product.interface";

export function useProduct(id?: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await ProductsApi.getById(id.toString());
      setProduct(response.data as Product);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProduct();
  }, [id]);

  return [product, loading, error, fetchProduct] as const;
}
