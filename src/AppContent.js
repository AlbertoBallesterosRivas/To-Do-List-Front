import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatus } from "./redux/slices/authSlice";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskList from "./components/TaskList";
import Navbar from "./components/Navbar";

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.tasks.loading);
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Mostrar un mensaje de carga o spinner mientras se verifica la autenticación
  if (isLoading) {
    return <div>Cargando...</div>; // Aquí puedes reemplazar con un componente de carga más elaborado
  }

  return (
    <>
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
    </>
  );
};

export default AppContent;
