import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../redux/authSlice';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(createTask({ title, date, tags: tags.split(',').map(tag => tag.trim()) }));
      setTitle('');
      setDate('');
      setTags('');
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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}

      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags (comma-separated)"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;