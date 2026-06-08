const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getResumes,
  addResume,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

router.get("/", protect, getResumes);
router.post("/", protect, upload.single("resume_pdf"), addResume);
router.delete("/:id", protect, deleteResume);

module.exports = router;