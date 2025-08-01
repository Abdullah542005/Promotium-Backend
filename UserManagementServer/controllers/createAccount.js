const users = require('../model/dbModel');
const {nanoid} = require("nanoid")

/* user = {
     address:{
         type:String,
         unique:true,
         require:true
     },
     fullName:String,
     username:String
     pfp :String,
     X:{username:String, token:String},
     facebook:{username:String, token:String},
} */

exports.createAccount = async (req, res) => {

  const { user } = req.body;

  try {
    const existingUser = await users.findOne({ address: user.userAddress });

    if (existingUser) {
      return res.status(400).json({ message: "User with same credentials exists" });
    }

    await users.insertOne({
      _id:nanoid(4),
      address:user.address,
      userName:user.userName,
      pfp:user.pfp,
      X:{username:user.X.username,token:user.X.token},
      facebook:{username:user.facebook.username,token:user.facebook.token}
    }).exec();

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    return res.status(500).json({ message: "Server issue, please contact developers", error: err.message });
  }
};