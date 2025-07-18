import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { Task, DeleteTaskContext } from '../../types';

/**
 * Mutation хук для удаления задачи с оптимистичными обновлениями
 */
export const useDeleteTask = (onLoadingChange?: (id: string, loading: boolean) => void) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, DeleteTaskContext>({
    mutationFn: api.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      // Добавляем ID в загрузку
      onLoadingChange?.(id, true);
      
      // Оптимистично удаляем задачу
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) => 
        old.filter(t => t.id !== id)
      );
      
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: (_data, _error, id) => {
      // Убираем ID из загрузки
      onLoadingChange?.(id, false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 