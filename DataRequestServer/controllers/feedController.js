const { Posts } = require('../models/dbModels');
exports.getFeed = async (req, res)=>{
    try{
        const {tags, lastSeen} = req.query;
        
        if(!tags){
            return res.status(400).json({message: "Missing 'tags' params"});
        }
        const tagArray = tags.split(",");
        const lastSeenDate = lastSeen ? new Date(lastSeen): new Date();
        
        const posts = await Posts.find({
            targetAudience : {$in: tagArray },
            timestamp: {$lt: lastSeenDate },
        })
        .sort({timestamp: -1})
        .limit(20)
        .select("postHead postBody timeStamp postType")
        .lean();

        return res.status(200).json(posts);
    }catch(err){
        console.error("feed Controller error is "+ err);
        return res.status(500).json({error: "Server error"});
    }
}