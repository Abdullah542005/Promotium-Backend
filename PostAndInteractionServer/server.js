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
    origin: 'http://localhost:5173',
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(express.json());

server.use('/api', routes);

server.listen(process.env.PORT || 4000, () => {
    console.log("Server listening on port 4001");
});
