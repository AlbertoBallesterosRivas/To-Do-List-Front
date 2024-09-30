import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/authSlice';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [values, setValues] = useState({ name: 'user', pass: 'user' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loginUser({ username: values.name, password: values.pass }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>You're currently logged in.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className='loginForm'>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          name="name"
          type="text"
          value={values.name}
          placeholder="Username"
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          name="pass"
          type="password"
          value={values.pass}
          placeholder="Password"
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          name="submit"
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
