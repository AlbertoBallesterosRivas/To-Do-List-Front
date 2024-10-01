import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice'; // Make sure this import path is correct

const Navbar = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around', padding: '1rem' }}>
        {isAuthenticated ? (
          <>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            {/* <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li> */}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;