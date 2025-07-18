/**
 * Общие типы, используемые в разных частях приложения
 */

export type TaskStatus = 'active' | 'completed';

export type FilterType = 'all' | 'active' | 'completed';

export type OutboxOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export type OutboxItemStatus = 'PENDING' | 'SYNCED'; 