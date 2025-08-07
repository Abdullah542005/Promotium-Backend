const {userModel} = require('../models/dbModels');

exports.getUserNotifications = async (req, res) => {
    try {
        const address = req.params.id; // Assuming user ID is passed as a URL parameter
        if (!address) {
            return res.status(400).json({ message: "address is required" });
        }
        // Fetch user notifications from the database
        const notifications = await userModel.findOne({address:address.toLowerCase()}).select('notifications').lean();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
