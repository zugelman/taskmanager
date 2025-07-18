import { useTasks } from '../queries/useTasks';
import { useCreateTask } from '../mutations/useCreateTask';
import { useUpdateTask } from '../mutations/useUpdateTask';
import { useDeleteTask } from '../mutations/useDeleteTask';
import { useLoadingStates } from '../hooks/useLoadingStates';
import type { Task } from '../../types';
import { toggleTaskStatus } from '../../helpers';

/**
 * Слайс для работы с задачами
 * Объединяет все query и mutation хуки
 */
export const useTasksSlice = () => {
  const tasksQuery = useTasks();
  const createTaskMutation = useCreateTask();
  
  // Управление состоянием загрузки
  const { loadingIds, addLoadingId, removeLoadingId, isTaskLoading } = useLoadingStates();
  
  const updateTaskMutation = useUpdateTask((id, loading) => {
    if (loading) {
      addLoadingId(id);
    } else {
      removeLoadingId(id);
    }
  });
  
  const deleteTaskMutation = useDeleteTask((id, loading) => {
    if (loading) {
      addLoadingId(id);
    } else {
      removeLoadingId(id);
    }
  });

  const tasks = tasksQuery.data || [];
  const isLoading = tasksQuery.isLoading;
  const isError = tasksQuery.isError;
  const error = tasksQuery.error;

  // Действия
  const createTask = (text: string) => {
    createTaskMutation.mutate(text);
  };

  const updateTask = (id: string, data: Partial<Omit<Task, 'id'>>) => {
    updateTaskMutation.mutate({ id, data });
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const updatedTask = toggleTaskStatus(task);
    updateTask(id, { status: updatedTask.status });
  };

  return {
    // Данные
    tasks,
    isLoading,
    isError,
    error,
    
    // Состояния мутаций
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    
    // Состояние загрузки по ID
    loadingIds,
    isTaskLoading,
    
    // Действия
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    
    // Ошибки мутаций
    createError: createTaskMutation.error,
    updateError: updateTaskMutation.error,
    deleteError: deleteTaskMutation.error,
  };
}; 