const { userModel, postModel } = require("../models/dbModel");
const { checkXInteraction } = require("./xService");
const { checkFacebookInteraction } = require("./facebookService");
const contract = require("../models/contractPostA");
const { toNumber } = require("ethers");

exports.interactPostA = async (req, res) => {
  try {
    const { postId, userAddress } = req.body;

    if (!postId || !userAddress) {
      return res.status(400).json({ message: "Missing postId or userAddress" });
    }

    const user = await userModel.findOne({ address: userAddress }).exec();
    if (!user) {
      return res.status(400).json({ message: "User Account Not Created" });
    }

    const post = await postModel.findOne({ _id: postId }).exec();
    if (!post) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    if (post.maximumInteraction <= post.interactionCount) {
      return res.status(400).json({ message: "Maximum Interaction Reached" });
    }

    if (post.interactions.find(i => i.promoterID === user._id)) {
      return res.status(400).json({ message: "Already an interactor to this post" });
    }

    // Check social media interactions
    const [xResult, fbResult] = await Promise.all([
      checkXInteraction(
        { token: user.X.token, userId: user.X.username },
        post.socialTask.get("X")?.[0]?.link.split("/").pop(),
        post.advertiserID
      ),
      checkFacebookInteraction(
        { token: user.facebook.token, userId: user.facebook.username },
        post.socialTask.get("facebook")?.[0]?.link.split("/").pop(),
        post.advertiserID
      ),
    ]);

    if (!xResult.success) {
      return res.status(400).json({ message: `X interaction check failed: ${xResult.error}` });
    }
    if (!fbResult.success) {
      return res.status(400).json({ message: `Facebook interaction check failed: ${fbResult.error}` });
    }

    // Execute smart contract
    const postNumber = toNumber(postId.split("_")[1]);
    if (isNaN(postNumber)) {
      return res.status(400).json({ message: "Invalid postId format" });
    }

    const tx = await contract.interactPost(postNumber, userAddress);
    const receipt = await tx.wait(); // Wait for transaction confirmation
    if (receipt.status !== 1) {
      return res.status(400).json({ message: "Smart contract execution failed" });
    }

    // Update database atomically
    const interactionId = `INT_${post.interactionCount + 1}`;
    await postModel.updateOne(
      { _id: postId },
      {
        $inc: { interactionCount: 1 },
        $push: {
          interactions: {
            interactedAt: Math.floor(Date.now() / 1000),
            promoterID: user._id,
            interactionID: interactionId,
          },
        },
      }
    );

    await userModel.updateOne(
      { _id: user._id },
      {
        $push: {
          interactions: { postID: post._id, interactionID: interactionId },
        },
      }
    );

    res.json({ message: "Interaction successful, token rewards processed" });
  } catch (error) {
    console.error("Error in interactPostA:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};