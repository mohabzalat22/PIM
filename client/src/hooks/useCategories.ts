import { useEffect, useState } from 'react';
import { CategoryApi } from '../api/categories';
import type CategoryInterface from '@/interfaces/category.interface';

export function useCategories(){
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryApi.getAll();
            setCategories(response.data as CategoryInterface[]);
        } catch (err: unknown) {
            const error = err as Error;
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return [categories, loading, error] as const;
}