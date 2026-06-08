const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cgpaRoutes = require("./routes/cgpaRoutes");
const examRoutes = require("./routes/examRoutes");
const notesRoutes = require("./routes/notesRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const holidayRoutes = require("./routes/holidayRoutes");
const classTopicRoutes = require("./routes/classTopicRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Smart College Assistant API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/cgpa", cgpaRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/reminders", reminderRoutes);

app.use("/api/holidays", holidayRoutes);
app.use("/api/class-topics", classTopicRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});