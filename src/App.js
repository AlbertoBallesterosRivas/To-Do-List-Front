import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logoutUser } from "./redux/authSlice";
import LoginForm from "./components/LoginForm";
import TaskList from "./components/TaskList";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      {/* Mostrar el botón de Logout siempre que el usuario esté autenticado */}
      {isAuthenticated && (
        <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          Logout
        </button>
      )}
      {isAuthenticated ? <TaskList /> : <LoginForm />}
    </div>
  );
};

export default App;
