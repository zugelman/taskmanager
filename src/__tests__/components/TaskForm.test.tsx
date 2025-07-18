import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../../components/TaskForm';

describe('TaskForm', () => {
  it('не даёт добавить пустую задачу', () => {
    const onAdd = jest.fn();
    render(<TaskForm onAdd={onAdd} loading={false} />);
    fireEvent.click(screen.getByText(/добавить/i));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByText(/текст не может быть пустым/i)).toBeInTheDocument();
  });

  it('вызывает onAdd при вводе текста', () => {
    const onAdd = jest.fn();
    render(<TaskForm onAdd={onAdd} loading={false} />);
    fireEvent.change(screen.getByLabelText(/новая задача/i), { target: { value: 'Тестовая задача' } });
    fireEvent.click(screen.getByText(/добавить/i));
    expect(onAdd).toHaveBeenCalledWith('Тестовая задача');
  });

  it('отключает поля при loading', () => {
    const onAdd = jest.fn();
    render(<TaskForm onAdd={onAdd} loading={true} />);
    expect(screen.getByLabelText(/новая задача/i)).toBeDisabled();
    expect(screen.getByText(/добавить/i)).toBeDisabled();
  });
}); 