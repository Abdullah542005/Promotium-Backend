const transporter   = require("../services/otpTransport")
const otpGenerator = require('otp-generator')
require('dotenv').config();
const otpList  = [];

exports.getEmailOtp = async (req,res)=>{
    try{
    const {email, userAddress}  = req.body;
    if(otpList.find((otpObject)=>otpObject.userAddress.toLowerCase() == userAddress.toLowerCase())){
        return res.status(400).json({message:"OTP already sent"})
    }
    let otp  = otpGenerator.generate(6,{specialChars:false,upperCaseAlphabets:false})
    otpList.push({otp:otp,email:email,userAddress:userAddress.toLowerCase(), timestamp:Math.floor(Date.now()/1000)})
    const mailOptions  = {
        from:process.env.EMAIL,
        to:email,
        subject:"Your Otp Code from Promotium",
        html:`<p>Your Email linking code is: <strong>${otp}</strong>, Expires in 10 mins`
    }
    transporter.sendMail(mailOptions);
    res.json({message:"Success"});
    return;
   } catch(error){
     res.status(401).json({message:"Server Encountered An Error"})
     console.log("Error At getOTP", error.message);
   }
}

exports.otpList = otpList;
