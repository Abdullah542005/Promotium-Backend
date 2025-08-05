const {userModel} = require('../models/dbModels');

exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming user ID is passed as a URL parameter
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Fetch user notifications from the database
        const notifications = await userModel.findById(userId).select('notifications').lean();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
