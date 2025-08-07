
const userModel = require("../model/dbModel")

exports.clearNotifications = async (req, res) => {
  const  address  = req.params.address;
    if (!address) {
      return res.status(400).json({ message: "Username is required" });
    }
    try {
      const user = await userModel.findOne({address:address.toLowerCase()});
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
