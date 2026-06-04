const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

const router = express.Router();

router.get("/", protect, getReminders);
router.post("/", protect, addReminder);
router.put("/:id", protect, updateReminder);
router.delete("/:id", protect, deleteReminder);

module.exports = router;