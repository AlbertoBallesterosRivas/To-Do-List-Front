import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks, deleteTask } from '../redux/slices/taskSlice';
import AddTaskForm from "./AddTaskForm";
import TaskModal from "./TaskModal";
import "../styles/TaskList.scss";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks ? tasks.filter((task) =>
    task.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

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
    return new Date().toLocaleDateString("en-US", options);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>
        <span className="date">{formatDate()}</span>
        <span className="user">{getGreeting()}</span>
      </h2>
      <input
        type="text"
        placeholder="Search tasks"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: "20px", padding: "10px" }}
      />
      <AddTaskForm />
      {(!tasks || tasks.length === 0) ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => {
            const tagIds = (task.relationships?.field_tags?.data || []).map(tag => tag.id);
  
            return (
              <li key={task.id} className="task-item">
                <div className="task-title">{task.attributes.title}</div>
                <div className="task-date">
                  End date:{" "}
                  {task.attributes.field_end
                    ? new Date(task.attributes.field_end).toLocaleDateString()
                    : "No end date"}
                </div>
                <div className="task-tags">
                  Tags:{" "}
                  {tagIds.length > 0
                    ? tagIds.map((tag) => (
                        <span key={tag} className="task-tag">
                          {tag}
                        </span>
                      ))
                    : "No tags"}
                </div>
                <div className="task-date">
                  Created: {new Date(task.attributes.created).toLocaleString()}
                </div>
                <div className="task-date">
                  Last changed:{" "}
                  {new Date(task.attributes.changed).toLocaleString()}
                </div>
                <div className="task-buttons">
                  <button
                    className="task-button"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="task-button delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {editingTask && (
        <TaskModal task={editingTask} onClose={() => setEditingTask(null)} />
      )}
    </div>
  );
};

export default TaskList;