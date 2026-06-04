const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, addNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;