import "../App.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      registerUser({
        name: fullName,
        email,
        password,
        role,
      })
    );
  };

  return (
    <div className="register-wrapper">
      <section className="register-section">
        <div className="register-card">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join Attendify in seconds
          </p>

          {isError && (
            <p style={{ color: "red", textAlign: "center" }}>
              حدث خطأ أثناء التسجيل
            </p>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Full Name
              <input
                type="text"
                className="form-input"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

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
              Role
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
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

            <button
              type="submit"
              className="btn register-btn"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="register-bottom-text">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
