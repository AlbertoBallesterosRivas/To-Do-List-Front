import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks, deleteTask  } from "../redux/authSlice";
import AddTaskForm from './AddTaskForm';
import EditTaskForm from './EditTaskForm';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.auth);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };



  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Tasks</h2>
      <AddTaskForm />
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
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
                  <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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
