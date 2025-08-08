const {userModel, postModel, reportModel} = require("../models/dbModels");

exports.search = async (req,res)=>{ 
   try {
    const {by,value} = req.body;
    if(!by || !value)
        return res.status(400).json({message:"Insufficient Number Of Params"});
    switch (by){
       case "username":{
        const user = await userModel.findOne({username:value}).lean();
        if(!user)
           return res.json({message:"Not Found"});
        return res.json({pfp:user.pfp,fullName:user.fullName,username:user.username});
       }break;

       case "reportId":{
        const report = await reportModel.findOne({_id:value}).lean();
        if(!report)
           return res.json({message:"Not Found"});
        return res.json(report);
       } break;
       case "postId":{
        const post = await postModel.findOne({_id:value}).lean();
        if(!post)
            return res.json({message:"Not Found"});
        return res.json(post);
       }
       default:{
         return res.status(400).json({message:"Invalid search key (By) provided"});
       }
    }
    }catch(error) {
     console.log("Error at Search : "+ error.message)
   }
}