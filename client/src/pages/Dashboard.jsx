import { useEffect, useState } from "react";
import API from "../services/api";

function getUser() {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [exams, setExams] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [internships, setInternships] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = getUser();

  const fetchDashboardData = async () => {
    try {
      const [
        attendanceRes,
        remindersRes,
        examsRes,
        holidaysRes,
        internshipsRes,
      ] = await Promise.allSettled([
        API.get("/attendance"),
        API.get("/reminders"),
        API.get("/exams"),
        API.get("/holidays"),
        API.get("/internships"),
      ]);

      if (attendanceRes.status === "fulfilled") {
        setAttendance(attendanceRes.value.data);
      }

      if (remindersRes.status === "fulfilled") {
        setReminders(remindersRes.value.data);
      }

      if (examsRes.status === "fulfilled") {
        setExams(examsRes.value.data);
      }

      if (holidaysRes.status === "fulfilled") {
        setHolidays(holidaysRes.value.data);
      }

      if (internshipsRes.status === "fulfilled") {
        setInternships(internshipsRes.value.data);
      }
    } catch (error) {
      console.log("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSubjects = attendance.length;

  const totalClasses = attendance.reduce(
    (sum, item) => sum + Number(item.total_classes || 0),
    0
  );

  const attendedClasses = attendance.reduce(
    (sum, item) => sum + Number(item.attended_classes || 0),
    0
  );

  const overallAttendance =
    totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;

  const warningSubjects = attendance.filter((item) => {
    if (Number(item.total_classes) === 0) return false;

    const percent =
      (Number(item.attended_classes) / Number(item.total_classes)) * 100;

    return percent < Number(item.required_percentage || 75);
  });

  const today = new Date().toISOString().split("T")[0];

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const notifications = [];

  holidays.forEach((item) => {
    const date = item.holiday_date?.slice(0, 10);

    if (date === today) {
      notifications.push({
        id: `holiday-today-${item.id}`,
        text: `🎉 Today is holiday: ${item.title}`,
      });
    }

    if (date === tomorrow) {
      notifications.push({
        id: `holiday-tomorrow-${item.id}`,
        text: `🎉 Tomorrow is holiday: ${item.title}`,
      });
    }
  });

  exams.forEach((item) => {
    const date = item.exam_date?.slice(0, 10);

    if (date === today) {
      notifications.push({
        id: `exam-today-${item.id}`,
        text: `📝 Exam today: ${item.subject_name}`,
      });
    }

    if (date === tomorrow) {
      notifications.push({
        id: `exam-tomorrow-${item.id}`,
        text: `📝 Exam tomorrow: ${item.subject_name}`,
      });
    }
  });

  reminders.forEach((item) => {
    const date = item.reminder_date?.slice(0, 10);

    if (date === today) {
      notifications.push({
        id: `reminder-today-${item.id}`,
        text: `🔔 Reminder today: ${item.title}`,
      });
    }

    if (date === tomorrow) {
      notifications.push({
        id: `reminder-tomorrow-${item.id}`,
        text: `🔔 Reminder tomorrow: ${item.title}`,
      });
    }
  });

  internships.forEach((item) => {
    const date = item.deadline?.slice(0, 10);

    if (date === today || date === tomorrow) {
      notifications.push({
        id: `internship-${item.id}`,
        text: `💼 Internship deadline: ${item.company_name} - ${item.role_title}`,
      });
    }
  });

  warningSubjects.forEach((item) => {
    notifications.push({
      id: `attendance-${item.id}`,
      text: `⚠ ${item.subject_name} attendance is below required percentage.`,
    });
  });

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="sub-text">Welcome back, {user?.name || "Student"}</p>
        </div>

        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notifications.length > 0 && (
              <span className="notification-count">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-box">
              <h3>Notifications</h3>

              {notifications.length === 0 ? (
                <p>No notifications today.</p>
              ) : (
                notifications.map((notification) => (
                  <div className="notification-item" key={notification.id}>
                    {notification.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="cards-grid">
        <div className="card">
          <h3>Total Subjects</h3>
          <h1>{totalSubjects}</h1>
        </div>

        <div className="card">
          <h3>Overall Attendance</h3>
          <h1>{overallAttendance}%</h1>
          <p>
            {attendedClasses} / {totalClasses} classes attended
          </p>
        </div>

        <div className="card">
          <h3>Attendance Warnings</h3>
          <h1>{warningSubjects.length}</h1>
        </div>

        <div className="card">
          <h3>Total Notifications</h3>
          <h1>{notifications.length}</h1>
        </div>
      </div>

      <div className="section-card">
        <h2>Smart Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications today.</p>
        ) : (
          notifications.map((notification) => (
            <p key={notification.id}>{notification.text}</p>
          ))
        )}
      </div>

      <div className="section-card">
        <h2>Attendance Warnings</h2>

        {warningSubjects.length === 0 && <p>No attendance warnings.</p>}

        {warningSubjects.map((item) => (
          <p key={item.id}>
            ⚠ {item.subject_name} attendance is below required percentage.
          </p>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;