const jsonwebtoken  = require('jsonwebtoken')
require("dotenv").config()

exports.checkToken = async (req,res)=>{

    const token =  req.body["Authorization"].split(" ")[1];
    if(!token) res.status(400).json("JWT Missing") 
    try{
        jsonwebtoken.verify(token,process.env.JWT_SECRET)
        res.status(200).json('Success')
    } catch(error){
        res.status(401).json('Expired')   
        return;
    }
    
}