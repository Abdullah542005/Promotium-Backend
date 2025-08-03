const express  =  require("express");
const mongoose = require("mongoose");
const cors = require('cors')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" })
.then(() => {console.log("MongoDB connected")})
.catch((err) => console.log("DB error:", err));

app.use(express.json());
app.use(cors())
const feedRoutes = require("./routes/feedRoutes");

app.use("/api", feedRoutes);  

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
