import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../redux/slices/taskSlice';

const AddTaskForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(createTask({ title, date, tags: tags.split(',').map(tag => tag.trim()) }));
      setTitle('');
      setDate('');
      setTags('');
      setIsModalOpen(false); // Cerrar el modal al enviar el formulario
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

   // Definir los estilos como objetos JS
   const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button onClick={openModal}>Añadir Tarea</button>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button style={closeButtonStyle} onClick={closeModal}>
              &times;
            </button>
            <h2>Añadir Nueva Tarea</h2>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;
