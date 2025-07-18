import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';
import type { Task } from '../../types';

/**
 * Query хук для получения списка задач
 */
export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: api.getTasks,
    staleTime: 1000 * 60 * 5, // 5 минут
    gcTime: 1000 * 60 * 10, // 10 минут (бывший cacheTime)
  });
}; 