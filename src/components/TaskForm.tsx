import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { validateTaskText } from '../utils';
import type { TaskFormProps } from '../types';

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, loading }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTaskText(text);
    if (!validation.isValid) {
      setError(validation.error || 'Ошибка валидации');
      return;
    }
    onAdd(text.trim());
    setText('');
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} mb={3}>
      <TextField
        label="Новая задача"
        value={text}
        onChange={e => setText(e.target.value)}
        error={!!error}
        helperText={error}
        size="small"
        fullWidth
        disabled={loading}
      />
      <Button type="submit" variant="contained" disabled={loading}>
        Добавить
      </Button>
    </Box>
  );
};

export default TaskForm; 