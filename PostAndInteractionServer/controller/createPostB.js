const ethers = require("ethers");
const { postModel, userModel } = require("../models/dbModel");

/*
    Requirement for frontend
    {
        postId
        postHead
        postBody
        maxInteraction
        rewardPerInteraction
        timestamp
        stakeRequired
        challengePeriod
    }
    Server Expects to Receive such post object from the frontend;
  
*/

exports.createPostB = (req, res) => {
try{    
  const { userAddress, post } = req.body;
  const userProfile = userModel.findOne({ address: userAddress });

  if (!userProfile)
    return res.status(400).json({ message: "User Doesnot Exits" });

  /* The Order of the attributes in calculating the hash strickly matters and also should be the
      same as that of the frontend*/
  const posthash = ethers.sha256(
    ethers.toUtf8Bytes(
      userAddress +
        post.postBody +
        post.postHead +
        post.timestamp +
        post.rewardPerInteraction +
        post.maximumInteraction +
        post.stakeRequired +
        post.challengePeriod
    )
  );

  postModel
    .insertOne({
      _id: "PSB_" + post.postId, //Prefixed with PSB (B, for challenge) to be easily recognized, Blockchain store post id as uint number only
      postBody: post.postBody,
      postHead: post.postHead,
      advertiserID: userProfile._id,
      timestamp: post.timestamp,
      targetAudience: post.targetAudience,
      postType: "Ordinary",
      interactionCount: 0,
      rewardPerInteraction: post.rewardPerInteraction,
      maximumInteraction: post.maximumInteraction,
      postHash: posthash,
      stakeRequired: post.stakeRequired,
      challengePeriod: post.challengePeriod,
    })
    .exec();

  res.json({ message: "Post Successfully Created" });
}catch(error){ 
    console.log("Error Message :" + error.message);
    console.log("Error At Create Post B");
}
};
