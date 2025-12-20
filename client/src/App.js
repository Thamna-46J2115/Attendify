import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Register from "./Components/Register";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Teacher from "./Components/Teacher";
import Student from "./Components/Student";
import Admin from "./Components/Admin";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Profile from "./Components/Profile";
import ProfileMenu from "./Components/ProfileMenu";
import Settings from "./Components/Settings";
import About from "./Components/About";
import Logout from "./Components/Logout";

function Layout() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <>
      {!hideLayout && <Header user={user} onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ProfileMenu" element={<ProfileMenu />} />
        <Route path="/teacher" element={<Teacher user={user} />} />
        <Route path="/student" element={<Student user={user} />} />
        <Route path="/admin" element={<Admin user={user} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={
            user ? <Profile user={user} /> : <Navigate to="/login" replace />
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
