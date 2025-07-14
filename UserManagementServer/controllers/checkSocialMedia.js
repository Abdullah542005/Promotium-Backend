const users = require('../model/dbModel');

exports.checkSocialMedia = async (req, res, next) => {
  const { user } = req.body;
  const { X, facebook } = user;

  if(!X || !facebook)
     return res.status(400).json({message:"Params Missing"})

  try {
    const existingX = await users.findOne({
      'X.username': X.username,
    });
    
    const existingfacebook  = await users.findOne({
      "facebook.username":facebook.username
    })
   
    if (!existingX) {
      return res.status(400).json({ message: "X account already linked" });
    }

    if(!existingfacebook){
      return res.status(400).json({ message: "facebok already linked " });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
