import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTasks } from "../redux/authSlice";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>You have no tasks.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.attributes.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
