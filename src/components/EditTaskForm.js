import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../redux/authSlice';

const EditTaskForm = ({ task, onCancel }) => {
  const [title, setTitle] = useState(task.attributes.title);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      try {
        await dispatch(updateTask({ taskId: task.id, updatedData: { title } })).unwrap();
        onCancel(); // Close the edit form
      } catch (error) {
        console.error('Failed to update task:', error);
        alert('Failed to update task. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Edit task title"
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditTaskForm;