const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getHolidays,
  addHoliday,
  deleteHoliday,
} = require("../controllers/holidayController");

const router = express.Router();

router.get("/", protect, getHolidays);
router.post("/", protect, addHoliday);
router.delete("/:id", protect, deleteHoliday);

module.exports = router;