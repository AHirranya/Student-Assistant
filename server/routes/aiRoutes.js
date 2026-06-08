const express = require("express");
const protect = require("../middleware/authMiddleware");
const { askPodAI } = require("../controllers/aiController");

const router = express.Router();

router.post("/ask", protect, askPodAI);

module.exports = router;