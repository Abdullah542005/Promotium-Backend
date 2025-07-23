const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
exports.authorization = (req, res, next) => {
   try {
    const token = req.body["Authorization"].split(" ")[1];
    if (!token) res.status(400).json("JWT Missing");
    jsonwebtoken.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json("Token Expired");
    return;
  }
};
