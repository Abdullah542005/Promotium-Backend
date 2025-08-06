const { validatorModel } = require('../models/dbModels');

exports.getValidator = async (req, res) => {
    try {
        const { userAddress } = req.body;
        if (!userAddress) {
            return res.status(400).json({ message: "Address is required" });
        }

        const validator = await validatorModel.findOne({ address:userAddress.toLowerCase() }).lean();

        if (!validator) {
            return res.status(404).json({ message: "Validator not found" });
        }

        res.status(200).json(validator);
    } catch (error) {
        console.error("Error fetching validator:", error.message);
        res.status(500).json({ message: "Error fetching validator", error: error.message });
    }
};
