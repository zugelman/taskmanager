import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { Task, CreateTaskContext } from '../../types';
import { createOptimisticTask } from '../../helpers';

/**
 * Mutation хук для создания задачи с оптимистичными обновлениями
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, string, CreateTaskContext>({
    mutationFn: api.createTask,
    onMutate: async (text) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      // Сохраняем предыдущее состояние для отката
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      // Оптимистично добавляем задачу в конец списка
      const optimisticTask = createOptimisticTask(text);
      
      queryClient.setQueryData<Task[]>(['tasks'], (old = []) => [
        ...old,
        optimisticTask
      ]);
      
      // Возвращаем контекст для отката
      return { previousTasks, optimisticTask };
    },
    onError: (_err, _text, context) => {
      // Откатываем при ошибке
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      // Всегда обновляем кэш после завершения
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}; 