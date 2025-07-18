import type { Task, FilterType } from '../types';

/**
 * Хелперы для работы с задачами
 */

/**
 * Фильтрует задачи по статусу
 */
export const filterTasks = (tasks: Task[], filter: FilterType): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter(task => task.status === 'active');
    case 'completed':
      return tasks.filter(task => task.status === 'completed');
    default:
      return tasks;
  }
};

/**
 * Создает новую задачу с дефолтными значениями
 */
export const createNewTask = (text: string): Task => {
  return {
    id: Date.now().toString(),
    text: text.trim(),
    status: 'active',
  };
};

/**
 * Создает оптимистичную задачу для UI
 */
export const createOptimisticTask = (text: string): Task => {
  return {
    id: `temp-${Date.now()}`,
    text: text.trim(),
    status: 'active',
  };
};

/**
 * Обновляет задачу с новыми данными
 */
export const updateTaskData = (task: Task, updates: Partial<Omit<Task, 'id'>>): Task => {
  return { ...task, ...updates };
};

/**
 * Переключает статус задачи
 */
export const toggleTaskStatus = (task: Task): Task => {
  return {
    ...task,
    status: task.status === 'completed' ? 'active' : 'completed',
  };
};

/**
 * Получает количество задач по статусам
 */
export const getTaskStats = (tasks: Task[]) => {
  return {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };
}; 