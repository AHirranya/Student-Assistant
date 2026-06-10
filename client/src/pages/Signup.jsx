import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const signupUser = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="mobile-auth-page">
      <div className="auth-welcome-card">
        <div className="auth-logo-large">CM</div>

        <h1>CampusMate</h1>
        <p>Your Smart College Companion</p>
      </div>

      <form className="mobile-auth-card" onSubmit={signupUser}>
        <h2>Create Account</h2>
        <p className="auth-small-text">Start managing your college life smarter</p>

        {message && <div className="error">{message}</div>}

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
          required
        />

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

        <button type="submit">Create Account</button>

        <p className="auth-bottom-text">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;