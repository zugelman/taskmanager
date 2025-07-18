import type { Task, TaskStatus, OutboxItem, OutboxOperationType, OutboxItemStatus } from './index';
import { isObject, isString } from '../utils/typeGuards';

/**
 * Type guards для проверки типов в runtime
 */

/**
 * Проверяет, является ли значение TaskStatus
 */
export const isTaskStatus = (value: unknown): value is TaskStatus => {
  return isString(value) && (value === 'active' || value === 'completed');
};

/**
 * Проверяет, является ли значение Task
 */
export const isTask = (value: unknown): value is Task => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isString(value.text) &&
    isTaskStatus(value.status)
  );
};

/**
 * Проверяет, является ли значение массивом Task
 */
export const isTaskArray = (value: unknown): value is Task[] => {
  if (!Array.isArray(value)) return false;
  return value.every(isTask);
};

/**
 * Проверяет, является ли значение OutboxOperationType
 */
export const isOutboxOperationType = (value: unknown): value is OutboxOperationType => {
  return isString(value) && ['CREATE', 'UPDATE', 'DELETE'].includes(value);
};

/**
 * Проверяет, является ли значение OutboxItemStatus
 */
export const isOutboxItemStatus = (value: unknown): value is OutboxItemStatus => {
  return isString(value) && (value === 'PENDING' || value === 'SYNCED');
};

/**
 * Проверяет, является ли значение OutboxItem
 */
export const isOutboxItem = (value: unknown): value is OutboxItem => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isOutboxOperationType(value.type) &&
    isObject(value.data) &&
    typeof value.timestamp === 'number' &&
    isOutboxItemStatus(value.status)
  );
};

/**
 * Проверяет, является ли значение массивом OutboxItem
 */
export const isOutboxItemArray = (value: unknown): value is OutboxItem[] => {
  if (!Array.isArray(value)) return false;
  return value.every(isOutboxItem);
};

/**
 * Проверяет, является ли значение объектом с данными для создания задачи
 */
export const isCreateTaskData = (value: unknown): value is { text: string } => {
  if (!isObject(value)) return false;
  
  return isString(value.text);
};

/**
 * Проверяет, является ли значение объектом с данными для обновления задачи
 */
export const isUpdateTaskData = (value: unknown): value is { id: string; updates: Partial<Omit<Task, 'id'>> } => {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    !!value.updates &&
    isObject(value.updates)
  );
};

/**
 * Проверяет, является ли значение объектом с данными для удаления задачи
 */
export const isDeleteTaskData = (value: unknown): value is { id: string } => {
  if (!isObject(value)) return false;
  
  return isString(value.id);
};

/**
 * Безопасно парсит JSON с проверкой типа
 */
export const safeJsonParse = <T>(json: string | null, guard: (value: unknown) => value is T, defaultValue: T): T => {
  if (!json) return defaultValue;
  
  try {
    const parsed = JSON.parse(json);
    return guard(parsed) ? parsed : defaultValue;
  } catch {
    return defaultValue;
  }
}; 