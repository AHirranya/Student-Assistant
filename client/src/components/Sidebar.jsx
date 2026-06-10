import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/attendance", icon: "📅", label: "Attendance" },
    { path: "/cgpa", icon: "📊", label: "CGPA" },
    { path: "/exams", icon: "📘", label: "Exams" },
    { path: "/notes", icon: "📝", label: "Notes" },
    { path: "/reminders", icon: "🔔", label: "Alerts" },
    { path: "/holidays", icon: "🎉", label: "Holidays" },
    { path: "/class-topics", icon: "📚", label: "Topics" },
    { path: "/internships", icon: "💼", label: "Jobs" },
    { path: "/resume", icon: "📄", label: "Resume" },
    { path: "/pod-ai", icon: "🤖", label: "AI" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-logo">CM</div>

        <div className="brand-text">
          <h2>CampusMate</h2>
          <p>Your Smart College Companion</p>
        </div>

        <button className="mobile-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <span>↪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;