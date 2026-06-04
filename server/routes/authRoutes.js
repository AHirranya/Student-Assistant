const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  signup,
  login,
  getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getProfile);

module.exports = router;