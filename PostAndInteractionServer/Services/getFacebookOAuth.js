const axios = require("axios");

async function checkFacebookInteraction({ token, userId }, postId, creatorId) {
  if (!token || !userId || !postId || !creatorId) {
    console.error("Invalid input parameters");
    return { success: false, error: "Missing or invalid input parameters" };
  }

  const apiBase = process.env.FB_API_BASE || "https://graph.facebook.com/v20.0";

  try {
    const [likeRes, commentRes, shareRes, followRes] = await Promise.all([
      axios.get(`${apiBase}/${postId}/likes?access_token=${token}`),
      axios.get(`${apiBase}/${postId}/comments?access_token=${token}`),
      axios.get(`${apiBase}/${postId}?fields=sharedposts.limit(1)&access_token=${token}`),
      axios.get(`${apiBase}/${userId}/subscribedto?access_token=${token}`),
    ]);

    const liked = likeRes.data.data?.some(l => l.id === userId);
    if (!liked) return { success: false, error: "User has not liked the post" };

    const commented = commentRes.data.data?.some(c => c.from.id === userId);
    if (!commented) return { success: false, error: "User has not commented on the post" };

    const shared = shareRes.data.sharedposts?.data?.some(s => s.from.id === userId);
    if (!shared) return { success: false, error: "User has not shared the post" };

    const followed = followRes.data.data?.some(p => p.id === creatorId);
    if (!followed) return { success: false, error: "User does not follow the creator" };

    return { success: true };
  } catch (err) {
    console.error("Facebook check error:", err.response?.data || err.message);
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

module.exports = { checkFacebookInteraction };