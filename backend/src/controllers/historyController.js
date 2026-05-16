const History = require('../models/History');

// @desc    Get user activity history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Get last 50 activities
    res.json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
};
