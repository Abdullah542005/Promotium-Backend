const dotenv = require("dotenv");

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors")

dotenv.config();

const app = express();
app.use(cors({
  credentials:true
}))
app.use  (express.json());
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.DB_CONNECTIONSTRING, { dbName: "Promotium" })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
