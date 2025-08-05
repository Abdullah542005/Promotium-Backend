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

exports.createPostB = async (req, res) => {
  try {
    const { userAddress, post } = req.body;

    if (!userAddress || !post) {
      return res.status(400).json({ message: "Missing userAddress or post data" });
    }

    // Find user
    const userProfile = await userModel.findOne({ address: userAddress }).exec();

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

    const newPost = await postModel.create({
      _id: "PSB_" + post.postId, //Prefixed with PSB (B, for challenge) to be easily recognized, Blockchain store post id as uint number only
      postBody: post.postBody,
      postHead: post.postHead,
      advertiserID: userProfile._id,
      timestamp: post.timestamp,
      targetAudience: post.targetAudience,
      postType: "Challenge",
      interactionCount: 0,
      rewardPerInteraction: post.rewardPerInteraction,
      maximumInteraction: post.maximumInteraction,
      postHash: posthash,
      stakeRequired: post.stakeRequired,
      challengePeriod: post.challengePeriod,
    });

    // added notification for User
    await userModel.updateOne(
      { address: userAddress },
      {
        $push: {
          notifications: {
            type: "Post Created",
            message: `Your challenge post ${newPost._id} has been created successfully.`,
          },
        },
      }
    );

    res.json({ message: "Challenge Post Successfully Created", postId: newPost._id });
  } catch (error) {
    console.log("Error Message :" + error.message);
    console.log("Error At Create Post B");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
