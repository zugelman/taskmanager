/**
 * Утилиты для работы с type guards
 */

/**
 * Проверяет, является ли значение объектом
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Проверяет, является ли значение строкой
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Проверяет, является ли значение числом
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Проверяет, является ли значение массивом
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Проверяет, является ли значение функцией
 */
export const isFunction = (value: unknown): value is Function => {
  return typeof value === 'function';
};

/**
 * Проверяет, является ли значение boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Проверяет, является ли значение null или undefined
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Проверяет, является ли значение не null и не undefined
 */
export const isNotNullOrUndefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}; 