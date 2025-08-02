const {userModel} = require('../models/dbModel');

exports.clearNotifications = async (req, res) => {
  const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    try {
      const user = await userModel.findById(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.notifications = [];
      await user.save();

      res.json({ message: "Notifications cleared successfully" });
    } catch (error) {
      console.error("Error clearing notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};
