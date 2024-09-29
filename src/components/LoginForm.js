import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/authSlice';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [values, setValues] = useState({ name: '', pass: '' });

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
    <div>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
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
      {loading && <p>Logging in, hold tight...</p>}
    </div>
  );
};

export default LoginForm;
