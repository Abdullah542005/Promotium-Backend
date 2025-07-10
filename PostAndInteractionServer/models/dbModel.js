const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "Promotium" });

const postSchema = new mongoose.Schema(
  {
    _id: {
      type:String,
      require:true
    },
    postHead: String,
    postBody: String,
    postHash: String,
    advertiserID: String,
    targetAudience: [String],
    timestamp: Number,
    rewardPerInteraction: Number,
    maximumInteraction: Number,
    interactionCount: Number,
    postType: {
      type: String,
      required: true,
      enum: ["Ordinary", "Challenge"],
    },
  },
  { discriminatorKey: postType, _id: false }
);

const postModel = mongoose.model("Post", postSchema);

const OrdinarySchema = postModel.discriminator(
  "Ordinary",
  new mongoose.Schema({
    socialTask: {
      type: Map,
      of: [{ task: String, link: String }],
    },
    interactions: [
      { interactionID: String, interactedAt: Number, promoterID: String },
    ],
  })
);

const ChallengeSchema = postModel.discriminator(
  "Challenge",
  new mongoose.Schema({
    stakeRequired: Number,
    challengeWindow: Number,
    interactions: [
      {
        interactionID: String,
        interactedAt: Number,
        promoterID: String,
        interactionBody: String,
        interactionHash: String,
        imageProofs: [String],
        isChallenged: Boolean,
        hasClaimed: Boolean,
        isValid: Boolean,
      },
    ],
  })
);


module.exports = postModel;
