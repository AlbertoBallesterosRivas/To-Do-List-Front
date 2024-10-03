import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice"; // Asegúrate de que esta ruta de importación sea correcta

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          justifyContent: "space-around",
          padding: "1rem",
        }}
      >
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
