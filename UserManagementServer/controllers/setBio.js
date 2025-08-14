const UserModel = require("../model/dbModel");

exports.setBio = async (req, res) => {
  try {
    const { userAddress, bio } = req.body;

    if (!userAddress || !bio) {
      return res.status(400).json({ message: "Insufficient Params" });
    }

    const result = await UserModel.updateOne(
      { address: userAddress.trim() },
      { $set: { bio: bio.trim() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Bio Set Successfully" });

  } catch (error) {
    console.error("Error At setBio:", error.message);
    return res.status(500).json({ message: "Server Encountered An Error" });
  }
};
