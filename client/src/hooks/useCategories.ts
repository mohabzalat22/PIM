import { useEffect, useState } from 'react';
import { CategoryApi } from '../api/categories';
import type Filters from '@/interfaces/category/category.filters.interface';

export function useCategories<T>(page: number, limit: number, filters?: Filters){
    const [categories, setCategories] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryApi.getAll(page, limit, filters);
            setCategories(response.data as T[]);
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
        fetchCategories();
    }, [page, limit, filters]);

    return [categories, loading, error, totalPages, fetchCategories] as const;
}