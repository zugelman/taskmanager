import { OutboxService } from '../services/OutboxService';
import { createTasksApi } from './tasks';

// Инициализируем outboxService
const outboxService = new OutboxService();
outboxService.initializeDefaultTasks();

// Создаем API с инжекцией outbox операций
export const api = createTasksApi({
  getTasksAfterProcessing: () => outboxService.getTasksAfterProcessing(),
  addOperation: (type, data) => outboxService.addOperation(type, data),
  processOutbox: () => outboxService.processOutbox(),
});

// Экспортируем типы
export * from './tasks'; 