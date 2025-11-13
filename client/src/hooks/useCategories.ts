import { useEffect, useState } from 'react';
import { CategoryApi } from '../api/categories';
import type Filters from '@/interfaces/category/category.filters.interface';

export function useCategories<T>(page: number, limit: number, filters?: Filters){
    const [categories, setCategories] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryApi.getAll(page, limit, filters);
            setCategories(response.data as T[]);
        } catch (err: unknown) {
            const error = err as Error;
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, limit, filters]);

    return [categories, loading, error] as const;
}