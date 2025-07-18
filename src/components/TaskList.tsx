import React from 'react';
import type { TaskListProps } from '../types';
import TaskItem from './TaskItem';
import { List, Paper, Typography } from '@mui/material';
import { filterTasks } from '../helpers';

const TaskList: React.FC<TaskListProps> = ({ tasks, filter, onToggle, onDelete, onEdit, loadingIds }) => {
  const filtered = filterTasks(tasks, filter);

  if (!filtered.length) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography align="center" color="text.secondary">
          Нет задач
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {filtered.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          loading={loadingIds.has(task.id)}
        />
      ))}
    </List>
  );
};

export default TaskList; 