const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model/dbModel');

const { nonceList } = require("./getNonce");

exports.login = (req,res)=>{
    const {signature, message } = req.body;

    const userNonceObj = nonceList.find(item => item.address === message.userAddress);
    if(!userNonceObj){
        return res.status(400).json({message: "Nonce not found for this address"});
    }
    
    const payload = {
        userAddress: message.userAddress,
        timestamp: Math.floor(Date.now() / 1000)
    }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({ token });
}