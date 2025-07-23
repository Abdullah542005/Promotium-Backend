const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" });

const userSchema  = new mongoose.Schema({
    _id:{
         type:String,
         unique:true,
         require:true
    },
     address:{
         type:String,
         unique:true,
         require:true
     },
     fullName:String,
     username:{
         type:String,
         unique:true,
         require:true
     },
     bio:String,
     country:String,
     pfp :String,
     X:{username:String, token:String},
     facebook:{username:String, token:String},
     followers:[String],
     follows:[String],
     posts:[String],
     interactions:[{postID:String, interactionID:String}],
     isValidator:Boolean
})

module.exports = mongoose.model('User', userSchema);
