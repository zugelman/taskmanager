import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { Task, UpdateTaskVariables, UpdateTaskContext } from '../../types';

/**
 * Mutation хук для обновления задачи с оптимистичными обновлениями
 */
export const useUpdateTask = (onLoadingChange?: (id: string, loading: boolean) => void) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskVariables, UpdateTaskContext>({
    mutationFn: ({ id, data }) => api.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      // Добавляем ID в загрузку
      onLoadingChange?.(id, true);
      
      // Оптимистично обновляем задачу
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) => 
        old.map(t => t.id === id ? { ...t, ...data } : t)
      );
      
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Убираем ID из загрузки
      onLoadingChange?.(variables.id, false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 