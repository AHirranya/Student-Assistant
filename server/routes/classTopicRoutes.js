const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getClassTopics,
  addClassTopic,
  deleteClassTopic,
} = require("../controllers/classTopicController");

const router = express.Router();

router.get("/", protect, getClassTopics);
router.post("/", protect, addClassTopic);
router.delete("/:id", protect, deleteClassTopic);

module.exports = router;