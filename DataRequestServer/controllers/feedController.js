const { Posts, Users } = require("../models/dbModels");

exports.getFeed = async (req, res) => {
  try {
    const { tags, lastSeen } = req.query;
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const lastSeenDate = lastSeen ? new Date(lastSeen) : new Date(0);

    if (tags) {
      const posts = await Posts.find({
        tags: { $in: tags.split(",") },
        timestamp: { $gt: lastSeenDate },
      })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

      return res.status(200).json(posts);
    }
    //authenticated user feed star from here
    if (req.user) {
      const currentUser = await Users.findOne({ userAddress: req.user.userAddress }).lean();
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const following = currentUser.following || [];

      const posts = await Posts.find({
        userAddress: { $in: following },
        timestamp: { $gt: lastSeenDate },
      })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

      return res.status(200).json(posts);
    }

    const posts = await Posts.find({
      timestamp: { $gt: twoDaysAgo },
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Feed Controller error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
