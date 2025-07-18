import { api } from '../api';

describe('mock API with outbox', () => {
  beforeEach(async () => {
    // Очищаем localStorage и outbox
    localStorage.clear();
    // Очищаем outbox отдельно
    localStorage.removeItem('tasks_outbox');
  });

  it('создаёт задачу через outbox', async () => {
    const task = await api.createTask('Новая задача');
    expect(task.text).toBe('Новая задача');
    expect(task.status).toBe('active');
    const tasks = await api.getTasks();
    expect(tasks.length).toBe(5); // 4 задачи по умолчанию + 1 новая
  });

  it('обновляет задачу через outbox', async () => {
    const task = await api.createTask('Обновить меня');
    const updated = await api.updateTask(task.id, { text: 'Обновлено', status: 'completed' });
    expect(updated.text).toBe('Обновлено');
    expect(updated.status).toBe('completed');
  });

  it('удаляет задачу через outbox', async () => {
    const task = await api.createTask('Удалить меня');
    await api.deleteTask(task.id);
    const tasks = await api.getTasks();
    expect(tasks.find((t) => t.id === task.id)).toBeUndefined();
    expect(tasks.length).toBe(4); // только задачи по умолчанию
  });

  it('возвращает задачи из localStorage после обработки outbox', async () => {
    await api.createTask('Persisted');
    const tasks1 = await api.getTasks();
    expect(tasks1.length).toBeGreaterThan(4); // минимум 4 задачи по умолчанию
    
    // Проверяем, что данные остались в localStorage
    const raw = localStorage.getItem('tasks');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.length).toBeGreaterThan(4);
    
    // Проверяем, что outbox очистился
    const outboxRaw = localStorage.getItem('tasks_outbox');
    if (outboxRaw) {
      const outbox = JSON.parse(outboxRaw);
      const pendingItems = outbox.filter((item: { status: string }) => item.status === 'PENDING');
      expect(pendingItems.length).toBe(0);
    }
  });

  it('инициализирует задачи по умолчанию при пустом localStorage', async () => {
    // Очищаем localStorage
    localStorage.clear();
    
    // Получаем задачи - должны появиться дефолтные
    const tasks = await api.getTasks();
    expect(tasks.length).toBe(4);
    expect(tasks[0].text).toBe('Сделать тестовое');
    expect(tasks[1].text).toBe('Запушить на гит');
    expect(tasks[2].text).toBe('Сообщить работодателю');
    expect(tasks[3].text).toBe('Получить оффер');
  });

  it('создаёт задачи с правильным порядком (в конец списка)', async () => {
    await api.createTask('Первая задача');
    await api.createTask('Вторая задача');
    
    const tasks = await api.getTasks();
    const defaultTasksCount = 4; // задачи по умолчанию
    
    // Проверяем, что новые задачи в конце
    expect(tasks.length).toBe(defaultTasksCount + 2);
    expect(tasks[tasks.length - 2].text).toBe('Первая задача');
    expect(tasks[tasks.length - 1].text).toBe('Вторая задача');
  });
}); 