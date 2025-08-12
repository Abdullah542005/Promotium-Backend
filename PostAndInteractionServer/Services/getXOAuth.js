// getXOAuth.js
const axios = require("axios");
const { refreshTwitterToken } = require("./refreshTwitterToken");
const { userModel } = require("../models/dbModel");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.DB_CONNECTIONSTRING, {
  dbName: "promotium",
});
let stateCollection;

(async () => {
  await mongoClient.connect();
  stateCollection = mongoClient.db("promotium").collection("x_oauth_states");
})();

async function checkXInteraction(userId, tweetId, creatorId) {
  const user = await userModel.findById(userId);
  if (!user || !user.X?.token || !user.X?.refreshToken) {
    return { success: false, error: "User has no linked Twitter account" };
  }

  const apiBase = "https://api.twitter.com/2";

  async function fetchInteractions(accessToken) {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const [likeRes, retweetRes, tweetsRes, followRes] = await Promise.all([
      axios.get(`${apiBase}/tweets/${tweetId}/liking_users?user.fields=id`, { headers }),
      axios.get(`${apiBase}/users/${user.X.userID}/retweeted_tweets`, { headers }),
      axios.get(`${apiBase}/users/${user.X.userID}/tweets?tweet.fields=referenced_tweets`, { headers }),
      axios.get(`${apiBase}/users/${user.X.userID}/following?user.fields=id`, { headers }),
    ]);

    const liked = likeRes.data.data?.some(u => u.id === user.X.userID);
    if (!liked) return { success: false, error: "User has not liked the tweet" };

    const shared = retweetRes.data.data?.some(rt => rt.id === tweetId);
    if (!shared) return { success: false, error: "User has not retweeted the tweet" };

    const commented = tweetsRes.data.data?.some(t =>
      t.referenced_tweets?.some(r => r.id === tweetId)
    );
    if (!commented) return { success: false, error: "User has not commented on the tweet" };

    const followed = followRes.data.data?.some(u => u.id === creatorId);
    if (!followed) return { success: false, error: "User does not follow the creator" };

    return { success: true };
  }

  try {
    return await fetchInteractions(user.X.token);
  } catch (err) {
    if (err.response?.status === 401) {
      console.log("Token expired, refreshing...");
      try {
        const newTokens = await refreshTwitterToken(user.X.refreshToken);
        if (newTokens?.access_token) {
          await userModel.updateOne(
            { _id: userId },
            { $set: { "X.token": newTokens.access_token, "X.refreshToken": newTokens.refresh_token } }
          );
          return await fetchInteractions(newTokens.access_token);
        }
        return { success: false, error: "Token refresh failed" };
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        return { success: false, error: "Token refresh failed" };
      }
    }
    console.error("X check error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

module.exports = { checkXInteraction };
