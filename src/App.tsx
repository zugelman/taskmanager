import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import type { FilterType } from './types';
import TaskList from './components/TaskList';
import Loader from './components/Loader';
import { useTasksSlice } from './store';

const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Используем слайс для работы с задачами
  const {
    tasks,
    isLoading,
    isError,
    error,
    isCreating,
    loadingIds,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    createError,
    updateError,
    deleteError,
  } = useTasksSlice();

  // Обработчики ошибок
  React.useEffect(() => {
    if (createError) setErrorMessage('Не удалось создать задачу');
    if (updateError) setErrorMessage('Не удалось обновить задачу');
    if (deleteError) setErrorMessage('Не удалось удалить задачу');
  }, [createError, updateError, deleteError]);

  const handleAdd = (text: string) => {
    createTask(text);
  };

  const handleToggle = (id: string) => {
    toggleTask(id);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  const handleEdit = (id: string, text: string) => {
    updateTask(id, { text });
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Список задач
        </Typography>
        <TaskForm onAdd={handleAdd} loading={isCreating} />
        <TaskFilter value={filter} onChange={setFilter} />
      </Paper>
      {isLoading && <Loader />}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message || 'Ошибка загрузки задач'}
        </Alert>
      )}
      <TaskList
        tasks={tasks}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        loadingIds={loadingIds}
      />
      
      {/* Уведомления об ошибках */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
