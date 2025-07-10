const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "Promotium" });

const validatorSchema  = new mongoose.Schema({
      profileID:{
        type:String,
        require:true
      },
      _id:{
        type:String,
        require:true,
      },
      creditScore:Number,
      validations:[String],
      lastCheckIn:Number,
      lastAssignedReport:String
},{_id:false})

const reportSchema  = new mongoose.Schema({
     _id:{type:String,require:true},
     advertisorId:String,
     advertisorComment:String,
     promoterId:String,
     postId:String,
     interactionId:String,
     createdOn:Number,
     assignedValdators:[String],
     validatorsVote:[{validatorId:String,isValid:Boolean,comment:String}],
     validVotes:Number,
     invalidVotes:Number,
     isReportValid:Boolean
})

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


const userModel  = mongoose.model('User',userSchema);
const validatorModel  = mongoose.model('Validator',validatorSchema);
const reportModel  = mongoose.model('Report',reportSchema);

module.exports = {userModel,validatorModel,reportModel};

