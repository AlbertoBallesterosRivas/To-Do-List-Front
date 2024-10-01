import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask } from '../redux/authSlice';


const TaskModal = ({ task, onClose }) => {
  const [title, setTitle] = useState(task.attributes.title);
  const [date, setDate] = useState(task.attributes.date || '');
  const [tags, setTags] = useState(task.attributes.tags ? task.attributes.tags.join(', ') : '');
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTask({
      taskId: task.id,
      updatedData: {
        title,
        date,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      }
    }));
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for the transition to finish before closing
  };

  return (
    <div className={`modal-backdrop ${isVisible ? 'show' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isVisible ? 'show' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>&times;</button>
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
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
            placeholder="Tags (comma-separated)"
          />
          <div>
            <button type="submit">Update Task</button>
            <button type="button" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;