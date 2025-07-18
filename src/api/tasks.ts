import type { Task, OutboxOperations } from '../types';
import { delay } from '../utils';

/**
 * API endpoints для работы с задачами
 * OutboxService инициализируется отдельно
 */

// Создаем API с инжекцией outbox операций
export const createTasksApi = (outboxOps: OutboxOperations) => ({
  async getTasks(): Promise<Task[]> {
    await delay();
    return outboxOps.getTasksAfterProcessing();
  },
  
  async createTask(text: string): Promise<Task> {
    await delay();
    
    // 1. Добавляем операцию в outbox
    outboxOps.addOperation('CREATE', { text });
    
    // 2. Обрабатываем outbox (записываем в localStorage)
    await outboxOps.processOutbox();
    
    // 3. Возвращаем обновлённые данные
    const tasks = await outboxOps.getTasksAfterProcessing();
    return tasks[tasks.length - 1]; // новая задача будет последней
  },
  
  async updateTask(id: string, data: Partial<Omit<Task, 'id'>>): Promise<Task> {
    await delay();
    
    // 1. Добавляем операцию в outbox
    outboxOps.addOperation('UPDATE', { id, updates: data });
    
    // 2. Обрабатываем outbox
    await outboxOps.processOutbox();
    
    // 3. Возвращаем обновлённую задачу
    const tasks = await outboxOps.getTasksAfterProcessing();
    const updatedTask = tasks.find(t => t.id === id);
    
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return updatedTask;
  },
  
  async deleteTask(id: string): Promise<void> {
    await delay();
    
    // 1. Добавляем операцию в outbox
    outboxOps.addOperation('DELETE', { id });
    
    // 2. Обрабатываем outbox
    await outboxOps.processOutbox();
  },
}); 