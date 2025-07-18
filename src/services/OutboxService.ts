import type { OutboxItem, OutboxOperationType, Task } from '../types';
import { LocalStorageService } from './LocalStorageService';
import { generateId } from '../utils';
import { safeGetFromStorage, safeSetToStorage } from '../helpers';
import { isOutboxItemArray, isCreateTaskData, isUpdateTaskData, isDeleteTaskData } from '../types';

export class OutboxService {
  private readonly OUTBOX_KEY = 'tasks_outbox';
  private localStorageService = new LocalStorageService();
  
  private getOutbox(): OutboxItem[] {
    return safeGetFromStorage<OutboxItem[]>(this.OUTBOX_KEY, [], isOutboxItemArray);
  }
  
  private saveOutbox(outbox: OutboxItem[]): void {
    safeSetToStorage(this.OUTBOX_KEY, outbox);
  }
  
  addOperation(type: OutboxOperationType, data: unknown): void {
    const outbox = this.getOutbox();
    const item: OutboxItem = {
      id: `outbox-${generateId()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      status: 'PENDING'
    };
    
    outbox.push(item);
    this.saveOutbox(outbox);
  }
  
  async processOutbox(): Promise<void> {
    const outbox = this.getOutbox();
    let hasChanges = false;
    
    for (const item of outbox) {
      if (item.status === 'PENDING') {
        try {
          await this.executeOperation(item);
          item.status = 'SYNCED';
          hasChanges = true;
        } catch (error) {
          console.error('Failed to process outbox item:', error);
          // Оставляем как PENDING для повторной попытки
        }
      }
    }
    
    if (hasChanges) {
      this.saveOutbox(outbox);
    }
  }
  
  private async executeOperation(item: OutboxItem): Promise<void> {
    switch (item.type) {
      case 'CREATE':
        if (isCreateTaskData(item.data)) {
          this.localStorageService.createTask(item.data.text);
        } else {
          throw new Error('Invalid CREATE operation data');
        }
        break;
        
      case 'UPDATE':
        if (isUpdateTaskData(item.data)) {
          this.localStorageService.updateTask(item.data.id, item.data.updates);
        } else {
          throw new Error('Invalid UPDATE operation data');
        }
        break;
        
      case 'DELETE':
        if (isDeleteTaskData(item.data)) {
          this.localStorageService.deleteTask(item.data.id);
        } else {
          throw new Error('Invalid DELETE operation data');
        }
        break;
        
      default:
        throw new Error(`Unknown operation type: ${item.type}`);
    }
  }
  
  // Получить все задачи после обработки outbox
  async getTasksAfterProcessing(): Promise<Task[]> {
    await this.processOutbox();
    return this.localStorageService.getTasks();
  }
  
  // Очистить завершённые операции
  cleanupCompleted(): void {
    const outbox = this.getOutbox();
    const activeOutbox = outbox.filter(item => item.status === 'PENDING');
    this.saveOutbox(activeOutbox);
  }
  
  // Инициализировать задачи по умолчанию
  initializeDefaultTasks(): void {
    this.localStorageService.initializeDefaultTasks();
  }
} 