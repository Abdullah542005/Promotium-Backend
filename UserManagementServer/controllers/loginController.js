const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../model/dbModel");
const ethers = require("ethers");

const { nonceList } = require("./getNonce");

exports.login = async (req, res) => {
  const { signature, message } = req.body;

  const userNonceObj = nonceList.find(
    (item) => item.address === message.userAddress
  );

  if (!userNonceObj)
    return res
      .status(400)
      .json({ message: "Nonce not found for this address" });

  const signedMessage  = `Connecting to Promotium, Nonce:${userNonceObj.nonce}, Address:${userNonceObj.address}`
  if (                 //Singature Verification
    ethers
      .verifyMessage(signedMessage, signature)
      .toLocaleLowerCase() != message.userAddress.toLocaleLowerCase()
  )
    
    return res.status(400).json({ message: "Invalid Signature" });

  //Checking Whether User exits
  const user = await UserModel.findOne({
    userAddress: message.userAddress,
  });

  const payload = {
    userAddress: message.userAddress,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  //Discard Nonce Object
  nonceList.splice(nonceList.indexOf(userNonceObj), 1);

  //If User doesnot exits, Send a Message to create account.
  return res.json({
    token: token,
    ...(!user && { message: "User Account Not Created" }),
  });
};
