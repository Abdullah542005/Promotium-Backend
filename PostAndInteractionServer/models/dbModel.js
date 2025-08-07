const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" });

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
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
  { discriminatorKey:'postType', _id: false }
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
      { interactedAt: Number, promoterID: String, interactionID: String },
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
        claimUnlock: Number,
        hasClaimed: Boolean,
        isValid: Boolean,
        promoterUsername:String,
      },
    ],
  })
);

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    require: true,
  },
  address: {
    type: String,
    unique: true,
    require: true,
  },
  fullName: String,
  username: {
    type: String,
    unique: true,
    require: true,
  },
  bio: String,
  country: String,
  pfp: String,
  X: { username: String, token: String, refreshToken: String, userID: String },// changes: refresh token and numeric id
  facebook: { username: String, token: String },
  followers: [String],
  follows: [String],
  posts: [String],
  interactions: [{ postID: String, interactionID: String }],
  isValidator: Boolean,
 notifications: [
  {
    type: { type: String },
    message: { type: String },
  }
],

});

const userModel = mongoose.model("User", userSchema);

module.exports = { postModel, userModel };
