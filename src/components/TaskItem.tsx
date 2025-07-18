import React, { useState, useCallback } from 'react';
import type { TaskItemProps } from '../types';
import { Box, Checkbox, IconButton, TextField, Button, Typography, Chip, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';
import { isOptimisticTask, validateTaskText } from '../utils';
// eslint-disable-next-line import/no-extraneous-dependencies

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, loading }) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [error, setError] = useState('');

  // Проверяем, является ли задача оптимистичной (временной)
  const isOptimistic = isOptimisticTask(task.id);

  const handleToggle = useCallback(() => {
    if (loading) return; // Блокируем если уже загружается
    onToggle(task.id);
  }, [onToggle, task.id, loading]);

  const handleDelete = useCallback(() => {
    if (loading) return; // Блокируем если уже загружается
    onDelete(task.id);
  }, [onDelete, task.id, loading]);

  const handleEditClick = useCallback(() => {
    if (loading) return; // Блокируем если уже загружается
    setEditMode(true);
  }, [loading]);

  const handleSave = () => {
    const validation = validateTaskText(editText);
    if (!validation.isValid) {
      setError(validation.error || 'Ошибка валидации');
      return;
    }
    onEdit(task.id, editText.trim());
    setEditMode(false);
    setError('');
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditMode(false);
    setError('');
  };

  return (
    <Box display="flex" alignItems="center" gap={1} py={1}>
      <Box position="relative">
        <Checkbox
          checked={task.status === 'completed'}
          onChange={handleToggle}
          disabled={loading}
        />
        {loading && (
          <CircularProgress
            size={20}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-10px',
              marginLeft: '-10px',
            }}
          />
        )}
      </Box>
      {editMode ? (
        <>
          <TextField
            value={editText}
            onChange={e => setEditText(e.target.value)}
            size="small"
            error={!!error}
            helperText={error}
            disabled={loading}
            sx={{ flex: 1 }}
          />
          <Button onClick={handleSave} size="small" disabled={loading} variant="contained">Сохранить</Button>
          <Button onClick={handleCancel} size="small" disabled={loading}>Отмена</Button>
        </>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                wordBreak: 'break-word',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {task.text}
            </Typography>
            {isOptimistic && (
              <Chip
                icon={<SyncIcon />}
                label="Синхронизация"
                size="small"
                color="warning"
                variant="outlined"
              />
            )}
            {loading && !isOptimistic && (
              <Chip
                icon={<CircularProgress size={16} />}
                label="Обновление"
                size="small"
                color="info"
                variant="outlined"
              />
            )}
          </Box>
          <IconButton onClick={handleEditClick} size="small" disabled={loading}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleDelete} size="small" disabled={loading}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default TaskItem; 