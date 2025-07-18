import { useState, useCallback } from 'react';

/**
 * Хук для отслеживания состояния загрузки по ID
 * Позволяет блокировать UI для конкретных задач
 */
export const useLoadingStates = () => {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const addLoadingId = useCallback((id: string) => {
    setLoadingIds(prev => new Set(prev).add(id));
  }, []);

  const removeLoadingId = useCallback((id: string) => {
    setLoadingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const isTaskLoading = useCallback((id: string) => {
    return loadingIds.has(id);
  }, [loadingIds]);

  const clearLoadingIds = useCallback(() => {
    setLoadingIds(new Set());
  }, []);

  return {
    loadingIds,
    addLoadingId,
    removeLoadingId,
    isTaskLoading,
    clearLoadingIds,
  };
}; 