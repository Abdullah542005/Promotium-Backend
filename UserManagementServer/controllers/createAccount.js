const users = require("../model/dbModel");
const { nanoid } = require("nanoid");

exports.createAccount = async (req, res) => {
  const { user } = req.body;

  try {
    const existingUser = await users.findOne({ address: user.address });

    if (existingUser) {
      return res.status(400).json({ message: "User with same credentials exists" });
    }

    const newUser = new users({
      _id: nanoid(6),
      address: user.address.toLowerCase(),
      fullName: user.fullName,
      username: user.username,
      pfp: user.pfp,
      X: { username: user.X.username, token: user.X.token },
      facebook: { username: user.facebook.username, token: user.facebook.token },
      notifications: [
        {
          type: "Account Created",
          message: `Welcome ${user.username}, your account has been created successfully.`,
        },
      ],
    });

    await newUser.save();

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    return res.status(500).json({
      message: "Server issue, please contact developers",
      error: err.message,
    });
  }
};
