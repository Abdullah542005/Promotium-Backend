const express = require("express");
const routes  = require('./routes/routes')

const server  = express();
server.use('/api', routes);
server.use(express.json())
server.listen(4000);


