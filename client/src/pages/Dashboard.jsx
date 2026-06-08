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

  const todayReminders = reminders.filter(
    (item) => item.reminder_date?.slice(0, 10) === today
  );

  const tomorrowReminders = reminders.filter(
    (item) => item.reminder_date?.slice(0, 10) === tomorrow
  );

  const todayExams = exams.filter(
    (item) => item.exam_date?.slice(0, 10) === today
  );

  const tomorrowExams = exams.filter(
    (item) => item.exam_date?.slice(0, 10) === tomorrow
  );

  const todayHolidays = holidays.filter(
    (item) => item.holiday_date?.slice(0, 10) === today
  );

  const tomorrowHolidays = holidays.filter(
    (item) => item.holiday_date?.slice(0, 10) === tomorrow
  );

  const internshipDeadlines = internships.filter(
    (item) =>
      item.deadline?.slice(0, 10) === today ||
      item.deadline?.slice(0, 10) === tomorrow
  );

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="sub-text">
        Welcome back, {user?.name || "Student"}
      </p>

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
          <h3>Today’s Reminders</h3>
          <h1>{todayReminders.length}</h1>
        </div>
      </div>

      <div className="section-card">
        <h2>Smart Notifications</h2>

        {todayHolidays.map((item) => (
          <p key={`holiday-today-${item.id}`}>🎉 Today is holiday: {item.title}</p>
        ))}

        {tomorrowHolidays.map((item) => (
          <p key={`holiday-tomorrow-${item.id}`}>
            🎉 Tomorrow is holiday: {item.title}
          </p>
        ))}

        {todayExams.map((item) => (
          <p key={`exam-today-${item.id}`}>📝 Exam today: {item.subject_name}</p>
        ))}

        {tomorrowExams.map((item) => (
          <p key={`exam-tomorrow-${item.id}`}>
            📝 Exam tomorrow: {item.subject_name}
          </p>
        ))}

        {todayReminders.map((item) => (
          <p key={`reminder-today-${item.id}`}>🔔 Reminder today: {item.title}</p>
        ))}

        {tomorrowReminders.map((item) => (
          <p key={`reminder-tomorrow-${item.id}`}>
            🔔 Reminder tomorrow: {item.title}
          </p>
        ))}

        {internshipDeadlines.map((item) => (
          <p key={`internship-${item.id}`}>
            💼 Internship deadline: {item.company_name} - {item.role_title}
          </p>
        ))}

        {todayHolidays.length === 0 &&
          tomorrowHolidays.length === 0 &&
          todayExams.length === 0 &&
          tomorrowExams.length === 0 &&
          todayReminders.length === 0 &&
          tomorrowReminders.length === 0 &&
          internshipDeadlines.length === 0 && <p>No notifications today.</p>}
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