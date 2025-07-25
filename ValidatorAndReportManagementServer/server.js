const express  =  require("express");
const { route } = require("./routes/routes");
const {ListenValidatorEvents}  = require("./events/ValidatorEvents")
const {finalizeReports}   = require("./autonomous/finalizeReports")
const app = express();

app.use(express.json())
app.use(route);

ListenValidatorEvents();  //Start Listing to Validator Contract events
app.listen(4000); 

finalizeReports();  // Calls finazalize Report Once when the Server Starts, then its called every hour delay
setInterval(()=>{   
   finalizeReports();
},60 * 60 * 1000)

