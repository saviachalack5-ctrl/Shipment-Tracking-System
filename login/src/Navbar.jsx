import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import { User, Ship } from "lucide-react"; 

const Navbar = ({ current, onUserClick, user, userSettings }) => {

  return (
    <nav className="navbar">

      <div className="navbar-left">
        <Ship className="navbar-logo" color="#FFC300" size={26} />
        <span className="navbar-title">ShipTrack</span>
      </div>

      <div className="navbar-links">
        <Link
          to="/shipments"
          className={`nav-link ${current === "shipments" ? "active" : ""}`}
        >
          Shipments
        </Link>

        {userSettings?.Report && (
          <Link
            to="/report"
            className={`nav-link ${current === "report" ? "active" : ""}`}
          >
            Reports
          </Link>
        )}

        {userSettings?.News && (
          <Link
            to="/news"
            className={`nav-link ${current === "news" ? "active" : ""}`}
          >
            News
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <span className="navbar-user-name">
            {user.name || user.email}
          </span>
        ) : null}
        <User
          className="user-icon"
          size={22}
          onClick={onUserClick}
        />

        

      </div>
    </nav>
  );
};

export default Navbar;
