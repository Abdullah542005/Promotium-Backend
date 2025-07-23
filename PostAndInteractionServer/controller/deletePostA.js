
const { userModel,postModel } =  require("../models/dbModel");

//To be only executed if the metadata from contract is deleted, contract call is done from frontend.

exports.deletePostA = async (req, res)=>{
   try { 
     const {postId, userAddress} = req.body;

     const user = await userModel.findOne({ address: userAddress }).exec();
     const post = await postModel.findOne({ _id: postId }).exec();

    if (!user)
      return res.status(400).json({ message: "User Account Not Created" });
    if (!post) return res.status(400).json({ message: "Invalid Post ID" });

    if(post.advertiserID != user._id)
        return res.status(400).json({ message: "User Not Authorized to perform this action" });
 
    await postModel.deleteOne({ _id: postId }).exec();

    return res.json({message:"Post Successfull Deleted"});
     
   }catch(error){ 
    console.log("Error Message: " + error.message);
    console.log("There was problem at delete Post A");
   }
}