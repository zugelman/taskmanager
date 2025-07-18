import type { Task } from './entities';
import type { OutboxOperationType } from './common';

/**
 * Типы для API
 */

export interface CreateTaskRequest {
  text: string;
}

export interface UpdateTaskRequest {
  id: string;
  updates: Partial<Omit<Task, 'id'>>;
}

export interface DeleteTaskRequest {
  id: string;
}

// Функции для работы с outbox (инжектируются извне)
export interface OutboxOperations {
  getTasksAfterProcessing: () => Promise<Task[]>;
  addOperation: (type: OutboxOperationType, data: unknown) => void;
  processOutbox: () => Promise<void>;
} 