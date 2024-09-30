import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../redux/authSlice';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(createTask({ title }));
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter new task"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;