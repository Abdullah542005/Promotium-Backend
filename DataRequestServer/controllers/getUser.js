const { Users } = require("../models/dbModels");

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findById(id).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Get User error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
