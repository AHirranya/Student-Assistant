const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getInternships,
  addInternship,
  updateInternship,
  deleteInternship,
} = require("../controllers/internshipController");

const router = express.Router();

router.get("/", protect, getInternships);
router.post("/", protect, addInternship);
router.put("/:id", protect, updateInternship);
router.delete("/:id", protect, deleteInternship);

module.exports = router;