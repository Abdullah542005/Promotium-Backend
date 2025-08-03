require("dotenv").config();

const express = require("express");
const routes  = require('./routes/routes')


server.use('/api', routes);
server.use(express.json())
console.log("listening");
server.listen(4000);



