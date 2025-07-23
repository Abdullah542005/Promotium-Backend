const  { userModel, postModel }  = require("../models/dbModel");
const contract =  require("../models/contractPostA");
const { toNumber } = require("ethers");

exports.interactPostA = async (req, res) => {
  try {
    const { postId, userAddress } = req.body;

    const user = await userModel.findOne({ address: userAddress }).exec();
    const post = await postModel.findOne({ _id: postId }).exec();

    if (!user)
      return res.status(400).json({ message: "User Account Not Created" });
    if (!post) return res.status(400).json({ message: "Invalid Post ID" });

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

    // Remaining Code For Verifying User Interaction with the post using x and facebook APis
    //.........................
    //
    const isSuccess = await contract.interactPost(
      toNumber(postId.split("_")[1]),
      userAddress
    );

    if (!isSuccess)
      return res
        .status(400)
        .json({ message: "A Problem Occured Executing Smart Contract" });

    // Updating Database
    post.interactionCount++;
    let interactionId = "INT_" + post.interactionCount;
    post.interactions.push({
      interactedAt: Date.now() / 1000,
      promoterID: user._id,
      interactionID: interactionId,
    });

    await post.save();

    user.interactions.push({
      postID: post._id,
      interactionID: interactionId,
    });

    await user.save();

    res.json({
      message: "Interaction Successfull, Your token rewards are on there way",
    });
  } catch (error) {
    console.log("Error Occured At Interact Post A");
    console.log("Error Message: " + error.message);
  }
};
