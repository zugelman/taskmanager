import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { TaskFilterProps } from '../types';

const TaskFilter: React.FC<TaskFilterProps> = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      sx={{ mb: 3 }}
      size="small"
      color="primary"
    >
      <ToggleButton value="all">Все</ToggleButton>
      <ToggleButton value="active">Активные</ToggleButton>
      <ToggleButton value="completed">Выполненные</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default TaskFilter; 