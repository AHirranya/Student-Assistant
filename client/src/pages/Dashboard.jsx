import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    totalClasses > 0
      ? Number(((attendedClasses / totalClasses) * 100).toFixed(2))
      : 0;

  const getAttendanceStatus = (percentage) => {
    if (percentage < 50) {
      return {
        label: "Critical",
        message: "Very low attendance. Immediate action required.",
        className: "danger-critical",
        icon: "🚨",
      };
    }

    if (percentage < 65) {
      return {
        label: "High Risk",
        message: "Attendance is risky. Avoid missing classes.",
        className: "danger-high",
        icon: "⚠️",
      };
    }

    if (percentage < 75) {
      return {
        label: "Warning",
        message: "Attendance is below 75%. Be careful.",
        className: "danger-warning",
        icon: "⚡",
      };
    }

    return {
      label: "Good",
      message: "Attendance is safe. Keep maintaining it.",
      className: "danger-safe",
      icon: "✅",
    };
  };

  const attendanceStatus = getAttendanceStatus(overallAttendance);

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

  const smartNotifications = [];

  holidays.forEach((item) => {
    const date = item.holiday_date?.slice(0, 10);

    if (date === today) {
      smartNotifications.push({
        id: `holiday-today-${item.id}`,
        text: `🎉 Today is holiday: ${item.title}`,
      });
    }

    if (date === tomorrow) {
      smartNotifications.push({
        id: `holiday-tomorrow-${item.id}`,
        text: `🎉 Tomorrow is holiday: ${item.title}`,
      });
    }
  });

  exams.forEach((item) => {
    const date = item.exam_date?.slice(0, 10);

    if (date === today) {
      smartNotifications.push({
        id: `exam-today-${item.id}`,
        text: `📝 Exam today: ${item.subject_name}`,
      });
    }

    if (date === tomorrow) {
      smartNotifications.push({
        id: `exam-tomorrow-${item.id}`,
        text: `📝 Exam tomorrow: ${item.subject_name}`,
      });
    }
  });

  reminders.forEach((item) => {
    const date = item.reminder_date?.slice(0, 10);

    if (date === today) {
      smartNotifications.push({
        id: `reminder-today-${item.id}`,
        text: `🔔 Reminder today: ${item.title}`,
      });
    }

    if (date === tomorrow) {
      smartNotifications.push({
        id: `reminder-tomorrow-${item.id}`,
        text: `🔔 Reminder tomorrow: ${item.title}`,
      });
    }
  });

  internships.forEach((item) => {
    const date = item.deadline?.slice(0, 10);

    if (date === today || date === tomorrow) {
      smartNotifications.push({
        id: `internship-${item.id}`,
        text: `💼 Internship deadline: ${item.company_name} - ${item.role_title}`,
      });
    }
  });

  const upcomingExams = exams
    .filter((exam) => exam.exam_date)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
    .slice(0, 3);

  const recentReminders = reminders
    .filter((reminder) => reminder.reminder_date)
    .sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date))
    .slice(0, 3);

  return (
    <div className="dashboard-page">
      <div className="dashboard-top">
        <div>
          <h1>Dashboard</h1>
          <p className="sub-text">
            Welcome back, {user?.name || "Student"} 👋
          </p>
        </div>

        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {smartNotifications.length > 0 && (
              <span className="notification-count">
                {smartNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-box">
              <h3>Notifications</h3>

              {smartNotifications.length === 0 ? (
                <p>No notifications today.</p>
              ) : (
                smartNotifications.map((item) => (
                  <div className="notification-item" key={item.id}>
                    {item.text}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions-card">
        <h2>My Actions</h2>
        <p>Access all student tools from one place</p>

        <div className="quick-actions-grid">
          <Link to="/cgpa" className="quick-action-item">
            <span>📊</span>
            <div>
              <strong>CGPA</strong>
              <p>Calculate semester CGPA</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/notes" className="quick-action-item">
            <span>📝</span>
            <div>
              <strong>Notes</strong>
              <p>Upload and manage notes</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/holidays" className="quick-action-item">
            <span>🎉</span>
            <div>
              <strong>Holidays</strong>
              <p>View college holidays</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/class-topics" className="quick-action-item">
            <span>📚</span>
            <div>
              <strong>Topics</strong>
              <p>Track today&apos;s class topics</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/internships" className="quick-action-item">
            <span>💼</span>
            <div>
              <strong>Internships</strong>
              <p>Track applications</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/resume" className="quick-action-item">
            <span>📄</span>
            <div>
              <strong>Resume</strong>
              <p>Manage resume and ATS score</p>
            </div>
            <b>›</b>
          </Link>

          <Link to="/pod-ai" className="quick-action-item">
            <span>🤖</span>
            <div>
              <strong>POD AI</strong>
              <p>Ask your study assistant</p>
            </div>
            <b>›</b>
          </Link>
        </div>
      </div>

      <h2 className="section-title">Overview</h2>

      <div className="dashboard-card-grid">
        <div className={`dashboard-stat-card ${attendanceStatus.className}`}>
          <div className="stat-icon">📅</div>
          <h2>{overallAttendance}%</h2>
          <p>Attendance</p>
          <span>{attendanceStatus.label}</span>
        </div>

        <div className="dashboard-stat-card green-card">
          <div className="stat-icon">🎓</div>
          <h2>{totalSubjects}</h2>
          <p>Total Subjects</p>
          <span>Active</span>
        </div>

        <div className="dashboard-stat-card orange-card">
          <div className="stat-icon">📘</div>
          <h2>{upcomingExams.length}</h2>
          <p>Upcoming Exams</p>
          <span>This Month</span>
        </div>

        <div className="dashboard-stat-card blue-card">
          <div className="stat-icon">🔔</div>
          <h2>{recentReminders.length}</h2>
          <p>Reminders</p>
          <span>Pending</span>
        </div>
      </div>

      <div className={`attendance-status-panel ${attendanceStatus.className}`}>
        <h2>
          {attendanceStatus.icon} Attendance Status: {attendanceStatus.label}
        </h2>
        <p>{attendanceStatus.message}</p>
        <p>
          You attended {attendedClasses} out of {totalClasses} classes.
        </p>
      </div>

      <div className="dashboard-list-card">
        <div className="list-card-header">
          <h2>Upcoming Exams</h2>
          <span>{upcomingExams.length} items</span>
        </div>

        {upcomingExams.length === 0 ? (
          <p className="empty-text">No upcoming exams added.</p>
        ) : (
          upcomingExams.map((exam) => (
            <div className="exam-row" key={exam.id}>
              <div className="date-box">
                <strong>
                  {new Date(exam.exam_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                  })}
                </strong>
                <span>
                  {new Date(exam.exam_date).toLocaleDateString("en-IN", {
                    month: "short",
                  })}
                </span>
              </div>

              <div className="row-content">
                <h3>{exam.subject_name}</h3>
                <p>
                  {exam.exam_time || "Time not set"}{" "}
                  {exam.room_no ? `• Room ${exam.room_no}` : ""}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-list-card">
        <div className="list-card-header">
          <h2>Recent Reminders</h2>
          <span>{recentReminders.length} items</span>
        </div>

        {recentReminders.length === 0 ? (
          <p className="empty-text">No reminders added.</p>
        ) : (
          recentReminders.map((reminder) => (
            <div className="reminder-row" key={reminder.id}>
              <div className="reminder-dot"></div>

              <div className="row-content">
                <h3>{reminder.title}</h3>
                <p>
                  {new Date(reminder.reminder_date).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-list-card">
        <div className="list-card-header">
          <h2>Smart Notifications</h2>
          <span>{smartNotifications.length}</span>
        </div>

        {smartNotifications.length === 0 ? (
          <p className="empty-text">No notifications today.</p>
        ) : (
          smartNotifications.map((item) => (
            <p className="smart-note" key={item.id}>
              {item.text}
            </p>
          ))
        )}
      </div>

      <div className="dashboard-list-card">
        <div className="list-card-header">
          <h2>Attendance Warnings</h2>
          <span>{warningSubjects.length}</span>
        </div>

        {warningSubjects.length === 0 ? (
          <p className="empty-text">No attendance warnings.</p>
        ) : (
          warningSubjects.map((item) => {
            const percent =
              Number(item.total_classes) > 0
                ? (
                    (Number(item.attended_classes) /
                      Number(item.total_classes)) *
                    100
                  ).toFixed(2)
                : 0;

            const status = getAttendanceStatus(Number(percent));

            return (
              <div className={`warning-row ${status.className}`} key={item.id}>
                <strong>
                  {status.icon} {item.subject_name}
                </strong>
                <p>
                  {percent}% attendance — {status.label}
                </p>
                <p>
                  {item.attended_classes} / {item.total_classes} classes
                  attended
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Dashboard;