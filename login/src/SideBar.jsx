import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "./AuthContext";

const SideBar = ({ onClose, userSettings }) => {
  const { auth, clearAuthState } = useAuth();
  const navigate = useNavigate();
  const isAdmin = auth?.user?.role === "admin";

  const handleLogout = () => {
    clearAuthState();
    navigate("/login");
    onClose?.();
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-profile">
        <p className="sidebar-name">{auth?.user?.name || auth?.user?.email}</p>
        <p className="sidebar-role">{(auth?.user?.role || "").toUpperCase()}</p>
      </div>
      <nav>
        <ul className="Side-bar">
          <li>
            <Link className="SideBar-link" to="#" onClick={onClose}>
              Profile
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link className="SideBar-link" to="/users" onClick={onClose}>
                Users
              </Link>
            </li>
          )}
          {userSettings?.Actions && (
          <li>
            <Link className="SideBar-link" to="/ArchivedShipments" onClick={onClose}>
              Archives
            </Link>
          </li>
          )}
        </ul>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default SideBar;
