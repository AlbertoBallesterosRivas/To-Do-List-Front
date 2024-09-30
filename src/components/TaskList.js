import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks, deleteTask } from "../redux/authSlice";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.auth);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  // Función para actualizar el valor del término de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar tareas según el término de búsqueda
  const filteredTasks = tasks.filter((task) =>
    task.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>
        <span className="date">{formatDate()}</span>
        <span className="user">
          {getGreeting()}
        </span>
      </h2>
      {/* Añadir el campo de búsqueda */}
      <input
        type="text"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px", padding: "10px" }}
      />
      <AddTaskForm />
      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id}>
              {editingTaskId === task.id ? (
                <EditTaskForm
                  task={task}
                  onCancel={() => setEditingTaskId(null)}
                />
              ) : (
                <>
                  {task.attributes.title}
                  <button onClick={() => handleEditTask(task.id)}>Edit</button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
