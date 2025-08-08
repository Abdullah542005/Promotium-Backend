const express  =  require("express");
const route  = require("./routes/routes");
const {ListenValidatorEvents}  = require("./events/ValidatorEvents")
const {finalizeReports}   = require("./autonomous/finalizeReports")
const cors = require("cors")
const app = express();

app.use(cors({
  origin: true,          
  credentials: true     
}));

app.use(express.json())
app.use("/api",route);

ListenValidatorEvents();  //Start Listing to Validator Contract events
app.listen(process.env.PORT || 4005); 

finalizeReports();  // Calls finazalize Report Once when the Server Starts, then its called every hour delay
setInterval(()=>{   
   finalizeReports();
},60 * 60 * 1000)

