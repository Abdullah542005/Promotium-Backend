const users = require('../model/dbModel');

exports.checkUserName = async (req, res) => {
  try {
    const userName = req.params.userName;
    const existingUsername = await users.findOne({username:userName });
    if (existingUsername) {
      return res.status(400).json({ message: "Exists" });
    }else {
      return res.json({message:"Unique"})
    }

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
