const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", protect, getAttendance);
router.post("/", protect, addAttendance);
router.put("/:id", protect, updateAttendance);
router.delete("/:id", protect, deleteAttendance);

module.exports = router;