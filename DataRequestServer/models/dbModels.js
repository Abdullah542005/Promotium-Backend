const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "Promotium" });

const ordinarySchema = new mongoose.Schema({
  postId: { type: String, required: true },
  postType: { type: String, default: "ordinary" },
  postHead: String,
  postBody: String,
  postHash: String,
  targetAudience: [String],
  timestamp: { type: Date, default: Date.now },
  userAddress: { type: String, required: true },
  tags: [String],
});

const challengeSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  postType: { type: String, default: "challenge" },
  postHead: String,
  postBody: String,
  postHash: String,
  targetAudience: [String],
  timestamp: { type: Date, default: Date.now },
  userAddress: { type: String, required: true },
  challengeType: String,
  deadline: Date,
  tags: [String],
});

const userSchema = new mongoose.Schema({
  userAddress: { type: String, required: true, unique: true },
  following: [String],
});

const Posts = mongoose.model("Post", ordinarySchema); 
const Users = mongoose.model("User", userSchema);

module.exports = {
  Posts,
  OrdinarySchema: ordinarySchema,
  ChallengeSchema: challengeSchema,
  Users,
};
