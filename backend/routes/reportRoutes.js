const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");
const { getReport } = require("../controllers/reportController");

// Admin-only report route
router.get("/", protect, adminOnly, getReport);

module.exports = router;
