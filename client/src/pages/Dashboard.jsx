import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    attendance: [],
    cgpa: [],
    exams: [],
    notes: [],
    reminders: [],
  });

  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchData = async () => {
    try {
      const [attendance, cgpa, exams, notes, reminders] = await Promise.all([
        API.get("/attendance"),
        API.get("/cgpa"),
        API.get("/exams"),
        API.get("/notes"),
        API.get("/reminders"),
      ]);

      setStats({
        attendance: attendance.data,
        cgpa: cgpa.data,
        exams: exams.data,
        notes: notes.data,
        reminders: reminders.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalClasses = stats.attendance.reduce(
    (sum, item) => sum + Number(item.total_classes || 0),
    0
  );

  const attendedClasses = stats.attendance.reduce(
    (sum, item) => sum + Number(item.attended_classes || 0),
    0
  );

  const overallAttendance =
    totalClasses > 0
      ? ((attendedClasses / totalClasses) * 100).toFixed(2)
      : "0.00";

  const overallBelow50 = totalClasses > 0 && Number(overallAttendance) < 50;

  const attendanceWarnings = stats.attendance.filter((item) => {
    if (Number(item.total_classes) === 0) return false;

    const percent =
      (Number(item.attended_classes) / Number(item.total_classes)) * 100;

    return percent < Number(item.required_percentage);
  });

  const below50Subjects = stats.attendance.filter((item) => {
    if (Number(item.total_classes) === 0) return false;

    const percent =
      (Number(item.attended_classes) / Number(item.total_classes)) * 100;

    return percent < 50;
  });

  const notificationCount = below50Subjects.length + (overallBelow50 ? 1 : 0);

  const pendingNotes = stats.notes.filter((note) => !note.completed);

  const totalCredits = stats.cgpa.reduce(
    (sum, item) => sum + Number(item.credits || 0),
    0
  );

  const totalPoints = stats.cgpa.reduce(
    (sum, item) =>
      sum + Number(item.credits || 0) * Number(item.grade_points || 0),
    0
  );

  const cgpaValue =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  const today = new Date();

  const upcomingExam = stats.exams.find((exam) => {
    return new Date(exam.exam_date) >= today;
  });

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="sub-text">Welcome back, {user?.name}</p>
        </div>

        <div className="notification-wrapper">
          <button
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>

              {notificationCount === 0 ? (
                <p className="no-alert">No critical warning.</p>
              ) : (
                <>
                  {overallBelow50 && (
                    <div className="alert-item danger-alert">
                      <strong>Overall Attendance Warning</strong>
                      <p>Your overall attendance is {overallAttendance}%.</p>
                    </div>
                  )}

                  {below50Subjects.map((subject) => {
                    const percent = (
                      (Number(subject.attended_classes) /
                        Number(subject.total_classes)) *
                      100
                    ).toFixed(2);

                    return (
                      <div className="alert-item" key={subject.id}>
                        <strong>{subject.subject_name}</strong>
                        <p>Attendance is {percent}%. Below 50%.</p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="cards-grid">
        <div className="card">
          <h3>Total Subjects</h3>
          <h2>{stats.attendance.length}</h2>
        </div>

        <div className="card">
          <h3>Overall Attendance</h3>
          <h2 className={overallBelow50 ? "red-text" : "blue-text"}>
            {overallAttendance}%
          </h2>
          <p>
            {attendedClasses} / {totalClasses} classes attended
          </p>
        </div>

        <div className="card warning">
          <h3>Attendance Warnings</h3>
          <h2>{attendanceWarnings.length}</h2>
        </div>

        <div className="card">
          <h3>Current CGPA</h3>
          <h2>{cgpaValue}</h2>
        </div>

        <div className="card">
          <h3>Upcoming Exams</h3>
          <h2>{stats.exams.length}</h2>
        </div>

        <div className="card danger">
          <h3>Pending Notes</h3>
          <h2>{pendingNotes.length}</h2>
        </div>

        <div className="card">
          <h3>Reminders</h3>
          <h2>{stats.reminders.length}</h2>
        </div>
      </div>

      {overallBelow50 && (
        <div className="critical-box">
          ⚠ Your overall attendance is below 50%. Attend more classes.
        </div>
      )}

      <div className="section-card">
        <h2>Next Exam</h2>
        {upcomingExam ? (
          <p>
            {upcomingExam.subject_name} on{" "}
            {new Date(upcomingExam.exam_date).toLocaleDateString()}
          </p>
        ) : (
          <p>No upcoming exam added.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;