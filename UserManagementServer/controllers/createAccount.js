const users = require('../model/dbModel');

exports.createAccount = async (req, res) => {
  const { user } = req.body;

  try {
    const existingUser = await users.findOne({ address: user.address });

    if (existingUser) {
      return res.status(400).json({ message: "User with same credentials exists" });
    }

    const newUser = await users.create(user);

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    return res.status(500).json({ message: "Server issue, please contact developers", error: err.message });
  }
};
