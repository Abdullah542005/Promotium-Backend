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
    }
    Server Expects to Receive such post object from the frontend;
  
*/

exports.createPostA = (req, res) => {
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
        post.maximumInteraction
    )
  );

  postModel.insertOne({
    _id: "PSA_" + post.postId, //Prefixed with PSA (A, for Ordinary) to be easily recognized, Blockchain store post id as number only
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
    socialTask: post.socialTasks,
  });

  res.json({ message: "Post Successfully Created" });
};
