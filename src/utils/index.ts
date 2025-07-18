/**
 * Утилиты - чистые функции без состояния
 */

// Основные утилиты
export * from './typeGuards';

/**
 * Создает случайную задержку для имитации API
 */
export const delay = (min: number = 500, max: number = 1000): Promise<void> => {
  const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
};

/**
 * Генерирует уникальный ID
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Генерирует временный ID для оптимистичных обновлений
 */
export const generateTempId = (): string => {
  return `temp-${Date.now()}`;
};

/**
 * Проверяет, является ли задача оптимистичной (временной)
 */
export const isOptimisticTask = (taskId: string): boolean => {
  return taskId.startsWith('temp-');
};

/**
 * Валидирует текст задачи
 */
export const validateTaskText = (text: string): { isValid: boolean; error?: string } => {
  const trimmedText = text.trim();
  
  if (!trimmedText) {
    return { isValid: false, error: 'Текст не может быть пустым' };
  }
  
  if (trimmedText.length > 500) {
    return { isValid: false, error: 'Текст слишком длинный (максимум 500 символов)' };
  }
  
  return { isValid: true };
}; 