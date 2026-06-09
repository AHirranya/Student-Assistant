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
    origin: [
      "http://localhost:5173",
      "https://student-assistant-frontend.onrender.com",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Smart College Assistant API is running...");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API test route working" });
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

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});