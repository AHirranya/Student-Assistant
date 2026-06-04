const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cgpaRoutes = require("./routes/cgpaRoutes");
const examRoutes = require("./routes/examRoutes");
const notesRoutes = require("./routes/notesRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart College Assistant API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/cgpa", cgpaRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/reminders", reminderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});