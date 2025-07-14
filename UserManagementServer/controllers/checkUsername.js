const users = require('../model/dbModel');

exports.checkUserName = async (req, res, next) => {
  const { user } = req.body;
  const { username } = user;

  try {
    const existingUsername = await users.findOne({username:username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
