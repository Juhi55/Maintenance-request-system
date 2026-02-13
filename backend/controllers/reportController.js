const Maintenance = require("../models/Maintenance");

// Get maintenance statistics
exports.getReport = async (req, res) => {
  try {
    const total = await Maintenance.countDocuments();
    const pending = await Maintenance.countDocuments({ status: "Pending" });
    const inProgress = await Maintenance.countDocuments({ status: "In Progress" });
    const completed = await Maintenance.countDocuments({ status: "Completed" });

    res.json({
      total,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
