import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'; // Importa solo loginUser, logout no es necesario aquí
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [values, setValues] = useState({ username: '', password: '' }); // Cambié los nombres para más claridad

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginUser({ username: values.username, password: values.password }));
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>You're currently logged in.</p>
        {/* No es necesario manejar logout aquí, se debe gestionar desde Navbar */}
      </div>
    );
  }

  return (
    <div className='loginForm'>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          name="username" // Cambié el nombre para que coincida con el objeto de inicio de sesión
          type="text"
          value={values.username}
          placeholder="Username"
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          name="password" // Cambié el nombre para que coincida con el objeto de inicio de sesión
          type="password"
          value={values.password}
          placeholder="Password"
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          type="submit"
          value="Login"
          disabled={loading}
        />
      </form>
      <Link to="/register">Don't have an account? Register here</Link>
      {loading && <p>Logging in, hold tight...</p>}
    </div>
  );
};

export default LoginForm;
