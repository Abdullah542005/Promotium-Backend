const {userModel, postModel} = require("../models/dbModels");

exports.getUser = async (req, res) => {
  try {
    const userName = req.params.id;
    const user  = await userModel.findOne({username:userName})
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Contains User Profle, His recent posts and interactions
    const userPosts = await postModel.find({advertiserID:user._id}).limit(15).lean();
    const postIDs = user.interactions.map((interaction)=>interaction.postID);
    const posts = await postModel.find({_id:{$in:postIDs}}).lean();

    const postMap = {};
     for (const post of posts) {
       postMap[post._id] = post;
    }
  
   const userInteractions = [];

   for (const interaction of user.interactions) {
        const post = postMap[interaction.postID];
         if (!post || !post.interactions) continue;
        const match = post.interactions.find(
          (i) => i.interactionID === interaction.interactionID
        );
        if (match) userInteractions.push({...match,postType:post.postType,postID:post._id});
    }

    const userObject = {
      profile:{
         userName:user.username,
         userAddress:user.address,
         fullName:user.fullName,
         pfp:user.pfp,
         bio:user.bio,
         socialLinks:{
           X: user.X.username,
           facebook:user.facebook.username
         },
         isValidator:user.isValidator
       },
       posts:[...userPosts],
       interactions:[...userInteractions]
      }
    return res.status(200).json(userObject);
  } catch (err) {
    console.error("Get User error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
