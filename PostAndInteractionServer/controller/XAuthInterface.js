// XAuthInterface.js
const axios = require("axios");
const querystring = require("querystring");

const clientId = process.env.TWITTER_CLIENT_ID;
const clientSecret = process.env.TWITTER_CLIENT_SECRET;
const redirectUri = process.env.TWITTER_REDIRECT_URI;

async function startAuth(req, res) {
  try {
    const authUrl = `https://twitter.com/i/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "tweet.read users.read follows.read follows.write like.read like.write offline.access",
      state: "state123",
      code_challenge: "challenge",
      code_challenge_method: "plain"
    })}`;

    res.redirect(authUrl);
  } catch (err) {
    console.error("Error starting Twitter auth:", err.message);
    res.status(500).json({ error: "Failed to start Twitter auth" });
  }
}

async function handleCallback(req, res) {
  try {
    const { code } = req.query;

    const tokenResponse = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      querystring.stringify({
        code,
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: "challenge"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    
    const profileResponse = await axios.get(
      "https://api.twitter.com/2/users/me?user.fields=username",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    const username = profileResponse.data.data.username;

   res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify({
          success: true,
          token:accessToken,
          profile:{username}
        })}, "https://dapp-promotium.netlify.app");
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Error in Twitter callback:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to complete Twitter auth" });
  }
}

module.exports = {
  startAuth,
  handleCallback
};
