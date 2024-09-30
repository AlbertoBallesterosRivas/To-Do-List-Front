import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus, logoutUser } from "./redux/authSlice";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskList from "./components/TaskList";
import './styles/main.scss';
import Navbar from "./components/Navbar";


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
    // <div className="App">
    //   <h1>Task Manager</h1>
    //   {/* Mostrar el botón de Logout siempre que el usuario esté autenticado */}
    //   {isAuthenticated && (
    //     <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px' }}>
    //       Logout
    //     </button>
    //   )}
    //   {isAuthenticated ? <TaskList /> : <LoginForm />}
    // </div>
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <TaskList /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
