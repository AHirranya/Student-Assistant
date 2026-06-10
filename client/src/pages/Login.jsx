import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mobile-auth-page">
      <div className="auth-welcome-card">
        <div className="auth-logo-large">CM</div>

        <h1>CampusMate</h1>
        <p>Your Smart College Companion</p>
      </div>

      <form className="mobile-auth-card" onSubmit={loginUser}>
        <h2>Welcome Back 👋</h2>
        <p className="auth-small-text">Login to continue your college dashboard</p>

        {message && <div className="error">{message}</div>}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p className="auth-bottom-text">
          New user? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;