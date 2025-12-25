import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TiAdjustContrast } from "react-icons/ti";
const Header = ({ user, onLogout }) => {
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("attendify-theme") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("attendify-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-logo">
        <Link to="/">Attendify</Link>
      </div>
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className={`nav-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`nav-link ${
                location.pathname === "/register" ? "active" : ""
              }`}
            >
              Register
            </Link>
          </>
        )}

        {user?.role === "student" && (
          <Link to="/student" className="nav-link">
            Student
          </Link>
        )}
        {user?.role === "teacher" && (
          <Link to="/teacher" className="nav-link">
            Teacher
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}

        <div className="theme-toggle" onClick={toggleTheme}>
          <TiAdjustContrast />
        </div>

        {/* 🔽 المينيو هنا */}
        {user && (
          <div className="profile-menu-container">
            <button
              className="profile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {menuOpen && (
              <div className="profile-dropdown">
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <Link to="/about">About</Link>
                <button onClick={onLogout} className="logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
