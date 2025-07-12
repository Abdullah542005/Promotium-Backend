const users = require('../model/dbModel');

exports.checkSocialMedia = async (req, res, next) => {
  const { user } = req.body;
  const { X, facebook } = user;

  try {
    const existingMedia = await users.findOne({
      'X.username': X.username,
      'facebook.username': facebook.username
    });

    if (existingMedia) {
      return res.status(400).json({ message: "Social usernames already exist" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
