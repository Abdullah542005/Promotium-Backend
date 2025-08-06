const {postModel}  = require('../models/dbModel')
const contract  =  require('../models/contractPostB')


// Should only be called after a user initiate and then deletes post metadata from the contract,
//else his funds would be stucked and then he has to delete from the blockchain explorer manually. 
exports.deletePostB = async (req, res) => {
  try {
    const { userAddress, postId } = req.body;
    const post = await postModel.findOne({ _id: postId }).exec();
    if (!post) 
        return res.status(400).json({ message: "Invalid Post ID" });

    if(post.advertiserID != userAddress)
        return res.status(400).json({message:"Not Authorized to interact with this post"});

    if (post.postType != "Challenge")
      return res.status(400).json({ message: "Use Ordinary Post Route" });

    await postModel.deleteOne({_id:postId}).exec();

    return res.json({message:"Post Successfully deleted from database"})

  } catch (error) {
    console.log("Error Message: " + error.message);
    console.log("Error At Deleting Post B");
  }
};
