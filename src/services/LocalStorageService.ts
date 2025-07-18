import type { Task } from '../types';
import { generateId } from '../utils';
import { safeGetFromStorage, safeSetToStorage } from '../helpers';
import { isTaskArray } from '../types';

export class LocalStorageService {
  private readonly STORAGE_KEY = 'tasks';
  
  private getDefaultTasks(): Task[] {
    return [
      { id: '1', text: 'Сделать тестовое', status: 'completed' },
      { id: '2', text: 'Запушить на гит', status: 'completed' },
      { id: '3', text: 'Сообщить работодателю', status: 'completed' },
      { id: '4', text: 'Получить оффер', status: 'active' },
    ];
  }
  
  initializeDefaultTasks(): void {
    const tasks = this.getTasks();
    if (tasks.length === 0) {
      this.saveTasks(this.getDefaultTasks());
    }
  }
  
  getTasks(): Task[] {
    return safeGetFromStorage<Task[]>(this.STORAGE_KEY, this.getDefaultTasks(), isTaskArray);
  }
  
  saveTasks(tasks: Task[]): void {
    safeSetToStorage(this.STORAGE_KEY, tasks);
  }
  
  createTask(text: string): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      id: generateId(),
      text,
      status: 'active',
    };
    
    tasks.push(newTask); // Добавляем в конец списка
    this.saveTasks(tasks);
    
    return newTask;
  }
  
  updateTask(id: string, updates: Partial<Omit<Task, 'id'>>): Task {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    this.saveTasks(tasks);
    
    return tasks[taskIndex];
  }
  
  deleteTask(id: string): void {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(t => t.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.saveTasks(filteredTasks);
  }
} 