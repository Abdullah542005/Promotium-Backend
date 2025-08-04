const {postModel} = require("../models/dbModels")

exports.generalFeed = async (req,res) =>{
     try{
      let timestamp = req.param.timestamp;
      if(!timestamp)
          timestamp  = Date.now()/1000; 
      const posts = await postModel.find({timestamp:{$lt:timestamp}}).
      sort({timestamp:-1}).limit(10).lean();
      return res.json(posts)
   }catch(error){
     console.log("Error at generalized Feed:  "+ error.message);
   }
}