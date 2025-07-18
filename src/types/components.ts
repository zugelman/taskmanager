import type { Task } from './entities';
import type { FilterType } from './common';

/**
 * Типы для компонентов
 */

export interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  loading?: boolean;
}

export interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  loadingIds: Set<string>;
}

export interface TaskFormProps {
  onAdd: (text: string) => void;
  loading: boolean;
}

export interface TaskFilterProps {
  value: FilterType;
  onChange: (value: FilterType) => void;
} 