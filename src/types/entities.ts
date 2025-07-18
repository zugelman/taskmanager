import type { TaskStatus, OutboxOperationType, OutboxItemStatus } from './common';

/**
 * Основные сущности приложения
 */

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
}

export interface OutboxItem {
  id: string;
  type: OutboxOperationType;
  data: unknown;
  timestamp: number;
  status: OutboxItemStatus;
} 