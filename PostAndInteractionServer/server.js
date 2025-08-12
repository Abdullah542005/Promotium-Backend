require("dotenv").config();
const express = require("express");
const routes  = require('./routes/routes');
const mongoose = require("mongoose");
const cors = require('cors');

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" })
.then(() => {console.log("MongoDB connected")})
.catch((err) => console.log("DB error:", err));

const server = express();

server.use(cors({
  origin: true,          
  credentials: true     
}));

server.use(express.json());

server.use('/api', routes);

server.listen(4001, () => {
    console.log("Server listening on port 4000");
});
