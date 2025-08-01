const { Posts } = require("../models/dbModels");

exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id).lean();
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (err) {
    console.error("Get Post error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
