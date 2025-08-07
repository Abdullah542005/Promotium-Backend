const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const TwitterStrategy = require("passport-twitter").Strategy;
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();


app.use(cors({
  origin: true,          
  credentials: true     
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,  
  resave: false,
  saveUninitialized: true,
  cookie:{secure:false}
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "https://usermanagementserver-zy5r.onrender.com/api/auth/twitter/callback"
}, (token, tokenSecret, profile, done) => {
  return done(null, { profile, token, tokenSecret });
}));



app.use("/api/auth", authRoutes);

   //Initial Route for Twitter
app.get("/api/auth/twitter", passport.authenticate("twitter"));
   //Call back Route
app.get("/api/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login-failure" }),
  (req, res) => {
    const user = req.user;
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`https://dapp-promotium.netlify.app/onboarding/success?user=${userData}`);
  }
);



app.get("/login-failure", (req, res) => {
  res.send("Twitter Authentication Failed!");
});



// MongoDB Connection
mongoose
  .connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
