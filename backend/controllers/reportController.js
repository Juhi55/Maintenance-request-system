const Maintenance = require("../models/Maintenance");

// Get maintenance statistics + full data
exports.getReport = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate("createdBy", "name email");

    const total = requests.length;
    const pending = requests.filter(r => r.status === "Pending").length;
    const inProgress = requests.filter(r => r.status === "In Progress").length;
    const completed = requests.filter(r => r.status === "Completed").length;

    res.json({
      total,
      pending,
      inProgress,
      completed,
      requests, // full data with user info
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
