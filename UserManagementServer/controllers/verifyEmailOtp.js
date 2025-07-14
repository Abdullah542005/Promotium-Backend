const {otpList}  = require("../controllers/getEmailOtp")
const UserModel   = require("../model/dbModel")

exports.verifyOTP = (req,res)=>{
    try{
     const {userAddress,otp}  = req.body;
     if(!userAddress || !otp) return res.status(400).json({message:"Insufficient Params"})
     const otpObject = otpList.find((object)=>object.otp == otp)
     if(!otpObject) return res.status(400).json({message:"Invalid OTP, Please Request One"})
     if(otpObject.userAddress != userAddress) return res.status(400).json({message:"Not Authorized"});
     if(otpObject.timestamp < Math.floor((Date.now()/1000) + 600 * 10**3)){   //10 Mins Expiry
        otpList.slice(otpList.indexOf(otpObject),1);
        return res.status(400).json({message:"OTP Expired, Please Request One"})
     }
     UserModel.updateOne({address:userAddress},{$set:{email:otpObject.email}}) 
     res.json({message:"Email Linked Successully"})  
     otpList.slice(otpList.indexOf(otpObject),1);     //Cleanup OTP After User

    }catch(error){
        res.status(401).json({message:"Server Encountered An Error"})
        console.log("Error At VerifyOTP", error.message);
    }  

}