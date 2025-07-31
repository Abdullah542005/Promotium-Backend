const axios = require("axios");

async function checkXInteraction({ token, userId }, tweetId, creatorId) {
  if (!token || !userId || !tweetId || !creatorId) {
    console.error("Invalid input parameters");
    return { success: false, error: "Missing or invalid input parameters" };
  }

  const headers = { Authorization: `Bearer ${token}` };
  const apiBase = process.env.X_API_BASE || "https://api.twitter.com/2";

  try {
    const [likeRes, retweetRes, tweetsRes, followRes] = await Promise.all([
      axios.get(`${apiBase}/tweets/${tweetId}/liking_users?user.fields=id`, { headers }),
      axios.get(`${apiBase}/users/${userId}/retweeted_tweets`, { headers }),
      axios.get(`${apiBase}/users/${userId}/tweets?tweet.fields=referenced_tweets`, { headers }),
      axios.get(`${apiBase}/users/${userId}/following?user.fields=id`, { headers }),
    ]);

    const liked = likeRes.data.data?.some(u => u.id === userId);
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
  } catch (err) {
    console.error("X check error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

module.exports = { checkXInteraction };