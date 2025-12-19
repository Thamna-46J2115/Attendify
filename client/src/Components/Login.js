import "../App.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError } = useSelector((state) => state.users);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      const userData = result.payload;

      localStorage.setItem("user", JSON.stringify(userData));

      localStorage.setItem("token", userData.token);

      setUser(userData);

      if (userData.role === "student") navigate("/student");
      else if (userData.role === "teacher") navigate("/teacher");
      else if (userData.role === "admin") navigate("/admin");
    } else {
      console.log("Login failed");
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);

      if (savedUser.role === "student") navigate("/student");
      else if (savedUser.role === "teacher") navigate("/teacher");
      else if (savedUser.role === "admin") navigate("/admin");
    }
  }, [navigate, setUser]);

  return (
    <div className="login-wrapper">
      <section className="login-section">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Login to your Attendify account</p>

          {isError && <p style={{ color: "red" }}>Invalid login</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Email
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form-label">
              Password
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn login-btn">
              Login
            </button>
          </form>

          <p className="login-bottom-text">
            Don’t have an account?{" "}
            <a href="/register" className="register-link">
              Register
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
