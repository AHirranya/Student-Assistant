const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, upload.single("note_pdf"), addNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;