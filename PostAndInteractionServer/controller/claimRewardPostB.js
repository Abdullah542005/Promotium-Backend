const contract = require("../models/contractPostB");
// To be only called if user has claimed the tokens from the contract, updates database only
// This route is only for post type B,  type A automatically sends tokens to promoters
exports.claimRewardsPostB = async (req, res) => {
  try {
    const { postId, userAddress } = req.body;
    const post = await postModel.findOne({ _id: postId }).exec();

    if (!post) return res.status(400).json({ message: "Invalid Post ID" });
    if (post.type != "Challenge")
      return res
        .status(400)
        .json({
          message: "This route is only availible for Challenge Posts Only",
        });

    // Checking from contract that user has claimed the tokens or not
    const userInteraction = await contract.interactions(
      toNumbertoNumber(postId.split("_")[1]),
      userAddress
    );

    if (!userInteraction.hasClaimed)
      return res
        .status(400)
        .json({ message: "Please Claim Tokens from the contract first" });

    // Updating Database
    for (let interaction in post.interactions)
      if (interaction.promoter == userAddress) {
        interaction.hasClaimed = true;
        post.save();
        break;
      }
  } catch (error) {
    console.log("Error Message :" + error.message);
    console.log("An Error Occured at Claim Rewards");
  }
};
