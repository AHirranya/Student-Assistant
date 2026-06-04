const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getCgpaSubjects,
  addCgpaSubject,
  deleteCgpaSubject,
} = require("../controllers/cgpaController");

const router = express.Router();

router.get("/", protect, getCgpaSubjects);
router.post("/", protect, addCgpaSubject);
router.delete("/:id", protect, deleteCgpaSubject);

module.exports = router;