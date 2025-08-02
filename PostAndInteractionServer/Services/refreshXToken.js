// twitterAuthService.js
const axios = require("axios");

async function refreshTwitterToken(refreshToken) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", process.env.TWITTER_CLIENT_ID);

  const response = await axios.post("https://api.twitter.com/2/oauth2/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data; // { access_token, refresh_token }
}

module.exports = { refreshTwitterToken };
