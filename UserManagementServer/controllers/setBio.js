const UserModel  = require("../model/dbModel")


exports.setBio = (req,res) => { 
     try{ 
        const {userAddress,bio}  = req.body
        if(!userAddress || !bio) return res.stats(400).json({message:"Insufficient Params"})
        UserModel.updateOne({address:userAddress}, {$set:{bio:bio}})
        return res.json({message:"Bio Set Successfully"})    
     }catch(error){ 
        res.status(401).json({message:"Server Encountered An Error"})
        console.log("Error At SetBio", error.message);
     }
}