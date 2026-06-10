import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: "🏠", label: "Home", mobile: true },
    { path: "/attendance", icon: "📅", label: "Attendance", mobile: true },
    { path: "/cgpa", icon: "📊", label: "CGPA", mobile: false },
    { path: "/exams", icon: "📘", label: "Exams", mobile: true },
    { path: "/notes", icon: "📝", label: "Notes", mobile: false },
    { path: "/reminders", icon: "🔔", label: "Alerts", mobile: true },
    { path: "/holidays", icon: "🎉", label: "Holidays", mobile: false },
    { path: "/class-topics", icon: "📚", label: "Topics", mobile: false },
    { path: "/internships", icon: "💼", label: "Jobs", mobile: false },
    { path: "/resume", icon: "📄", label: "Resume", mobile: false },
    { path: "/pod-ai", icon: "🤖", label: "AI", mobile: false },
    { path: "/profile", icon: "👤", label: "Profile", mobile: true },
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
              `${isActive ? "nav-link active" : "nav-link"} ${
                item.mobile ? "mobile-show" : "mobile-hide"
              }`
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