const axios = require("axios");
const crypto = require("crypto");
const { userModel } = require("../models/dbModel");

const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const REDIRECT_URI = process.env.TWITTER_REDIRECT_URI;
const codeVerifiers = new Map();

exports.XAuthInterface = async (req, res) => {
  const { step } = req.query;

  if (step === "initiate") {
    const codeVerifier = crypto.randomBytes(32).toString("hex");
    const state = crypto.randomBytes(16).toString("hex");

    codeVerifiers.set(state, codeVerifier);

    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(
      "tweet.read users.read offline.access"
    )}&state=${state}&code_challenge=${codeVerifier}&code_challenge_method=plain`;

    return res.json({ url: authUrl });
  }

  if (step === "callback") {
    const { code, state } = req.query;

    if (!code || !state || !codeVerifiers.has(state)) {
      return res.status(400).json({ error: "Invalid state or code" });
    }

    const codeVerifier = codeVerifiers.get(state);
    codeVerifiers.delete(state);

    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: codeVerifier,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, refresh_token } = tokenResponse.data;

      // Fetch user info
      const userInfo = await axios.get("https://api.twitter.com/2/users/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { id, username } = userInfo.data.data;

      await userModel.updateOne(
        { "X.userId": id },
        {
          $set: {
            "X.userId": id,
            "X.username": username,
            "X.token": access_token,
            "X.refreshToken": refresh_token,
          },
        },
        { upsert: true }
      );

      return res.json({
        success: true,
        message: "Twitter login successful",
        user: { id, username },
      });
    } catch (err) {
      console.error("Twitter OAuth error:", err.response?.data || err.message);
      return res.status(500).json({ error: "Twitter OAuth failed" });
    }
  }

  return res.status(400).json({ error: "Invalid step parameter" });
};
