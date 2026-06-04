import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2>Smart College</h2>
      <p>Assistant</p>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>
        <NavLink to="/cgpa">CGPA Predictor</NavLink>
        <NavLink to="/exams">Exam Planner</NavLink>
        <NavLink to="/notes">Notes</NavLink>
        <NavLink to="/reminders">Reminders</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;