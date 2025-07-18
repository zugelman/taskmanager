import { safeJsonParse } from '../types';

/**
 * Хелперы для работы с localStorage
 */

/**
 * Безопасно читает данные из localStorage
 */
export const safeGetFromStorage = <T>(key: string, defaultValue: T, guard?: (value: unknown) => value is T): T => {
  try {
    const data = localStorage.getItem(key);
    if (guard) {
      return safeJsonParse(data, guard, defaultValue);
    }
    if (data) {
      return JSON.parse(data) as T;
    }
  } catch (error) {
    console.error(`Failed to read from localStorage (${key}):`, error);
  }
  return defaultValue;
};

/**
 * Безопасно записывает данные в localStorage
 */
export const safeSetToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write to localStorage (${key}):`, error);
    throw error;
  }
};

/**
 * Безопасно удаляет данные из localStorage
 */
export const safeRemoveFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
  }
};

/**
 * Проверяет, поддерживается ли localStorage
 */
export const isLocalStorageSupported = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}; 