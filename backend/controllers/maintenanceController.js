const Maintenance = require("../models/Maintenance");

// Create request
exports.createRequest = async (req, res) => {
  try {
    const request = await Maintenance.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find().populate("createdBy", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
