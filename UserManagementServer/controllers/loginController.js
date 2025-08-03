const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/dbModel");
const ethers = require("ethers");

const { nonceList } = require("./getNonce");

exports.login = async (req, res) => {
  try{
  const { signature, userAddress } = req.body;
  
  const userNonceObj = nonceList.find(
    (item) => item.address === userAddress
  );
  if (!userNonceObj)
    return res
      .status(400)
      .json({ message: "Nonce not found for this address" });

  const signedMessage  = `Connecting to Promotium, Nonce:${userNonceObj.nonce}, Address:${userNonceObj.address}`

  if (                 //Singature Verification
    ethers
      .verifyMessage(signedMessage, signature)
      .toLocaleLowerCase() != userAddress.toLocaleLowerCase()
  )
    
    return res.status(400).json({ message: "Invalid Signature" });

  //Checking Whether User exits

  const user = await UserModel.findOne({
    address: userAddress.toLowerCase(),
  }).lean()

  const payload = {
    userAddress:userAddress,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  //Discard Nonce Object
  nonceList.splice(nonceList.indexOf(userNonceObj), 1);

  //If User doesnot exits, Send a Message to create account.
  return res.json({
    token: token,
    message : user?"Success":"CreateAccount",
    ...(user && {
      pfp:user.pfp,
      username:user.username,
      isEmailLinked:user.isEmailLinked,
      isValidator:user.isValidator,
      fullname:user.fullName
    })
  }); }
  catch(error){
    console.log("Error at Login: " + error.message)
  }
};
