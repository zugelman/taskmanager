import type { Task } from './entities';

/**
 * Типы для React Query store
 */

// Контексты для мутаций
export interface CreateTaskContext {
  previousTasks: Task[] | undefined;
  optimisticTask: Task;
}

export interface UpdateTaskContext {
  previousTasks: Task[] | undefined;
}

export interface DeleteTaskContext {
  previousTasks: Task[] | undefined;
}

// Переменные для мутаций
export interface UpdateTaskVariables {
  id: string;
  data: Partial<Omit<Task, 'id'>>;
}

// Возвращаемые типы для хуков
export interface TasksSliceReturn {
  // Данные
  tasks: Task[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Состояния мутаций
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Состояние загрузки по ID
  loadingIds: Set<string>;
  isTaskLoading: (id: string) => boolean;
  
  // Действия
  createTask: (text: string) => void;
  updateTask: (id: string, data: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Ошибки мутаций
  createError: Error | null;
  updateError: Error | null;
  deleteError: Error | null;
} 