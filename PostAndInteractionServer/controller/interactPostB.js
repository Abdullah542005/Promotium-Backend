const { postModel, userModel } = require("../models/dbModel");
const contract= require("../models/contractPostB");
const  { toUtf8Bytes }  =  require("ethers");
const ethers = require("ethers");

/* 
   data format for POST B Interaction Object to be received from frontend
   {
    interactionBody (String)
    imageProofs: [] (Array of Pinata's CID)
    timestamp
   }
*/

exports.interactPostB = async (req, res) => {
  try {
    const { postId, interactionObject, userAddress } = req.body;

    const user = await userModel.findOne({ address: userAddress }).exec();
    const post = await postModel.findOne({ _id: postId }).exec();

    if (!user)
      return res.status(400).json({ message: "User Account Not Created" });
    if (!post) return res.status(400).json({ message: "Invalid Post ID" });

    if (post.type != "Challenge")
      return res.status(400).json({ message: "Use Ordinary Post Route" });

    if (post.maximumInteraction <= post.interactionCount)
      return res.status(400).json({ message: "Maximum Interaction Reached" });

    if (
      post.interactions.find(
        (interaction) => interaction.promoterID == user._id
      )
    )
      return res
        .status(400)
        .json({ message: "Already an interactor to this post" });

    //This code makes sure user has approved tranaction of sending metadata to contract first
    //To be Added to Other functiosn too.
    const contractData = await contract.interactions(
      toNumber(postId.split("_")[1]),
      userAddress
    );
    if (contractData.timestamp == 0)
      return res
        .status(400)
        .json({ message: "Please store Metadata in blockchain first" });

    //Must to be calculated in the same order as this one for the frontend too
    const hash = ethers.sha256(
      toUtf8Bytes(
        interactionObject.interactionBody +
          interactionObject.imageProofs.join("")
      )
    );

    let interactionId = post.interactionCount++;
    post.interaction.push({
      interactionID: interactionId,
      interactedAt: interactionObject.timestamp,
      promoterID: user._id,
      interactionBody: interactionObject.interactionBody,
      interactionHash: hash,
      imageProofs: interactionObject.imageProofs,
      isChallenged: false,
      claimUnlock: interactionObject.timestamp + post.challengeWindow,
      hasClaimed: false,
      isValid: true,
    });
    await post.save();
    user.interactions.push({
      postID: post._id,
      interactionID: interactionId,
    });
    await user.save();
  } catch (error) {
    console.log("Error Occured At Interact Post B");
    console.log("Error Message: " + error.message);
  }
};
