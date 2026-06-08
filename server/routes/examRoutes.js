const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getExams,
  addExam,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

const router = express.Router();

router.get("/", protect, getExams);
router.post("/", protect, upload.single("exam_pdf"), addExam);
router.put("/:id", protect, updateExam);
router.delete("/:id", protect, deleteExam);

module.exports = router;