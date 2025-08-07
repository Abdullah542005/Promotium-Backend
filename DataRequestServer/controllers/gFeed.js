const { postModel } = require("../models/dbModels");

exports.generalFeed = async (req, res) => {
  try {
    let timestamp = req.query.timestamp; 
    if (!timestamp) timestamp = Date.now() / 1000;

    const posts = await postModel.aggregate([
      {
        $match: { timestamp: { $lt: parseInt(timestamp) } },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users", // MongoDB collection name for userModel
          localField: "advertiserID",
          foreignField: "_id",
          as: "advertiser",
        },
      },
      {
        $unwind: "$advertiser", 
      },
      {
        $project: {
          _id: 1,
          postHead: 1,
          postBody: 1,
          postType: 1,
          timestamp: 1,
          rewardPerInteraction: 1,
          maximumInteraction: 1,
          interactionCount: 1,
          stakeRequired:1,
          challengeWindow:1,
          socialTask:1,
          "advertiser.fullName": 1,
          "advertiser.username": 1,
          "advertiser.pfp": 1,
          "advertiser.address":1
        },
      },
    ]);

    return res.json(posts);
  } catch (error) {
    console.log("Error at generalized Feed: " + error.message);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
