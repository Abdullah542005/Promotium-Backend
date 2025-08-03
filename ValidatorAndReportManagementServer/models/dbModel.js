const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECTIONSTRING, { dbName: "promotium" });

const validatorSchema  = new mongoose.Schema({
      profileID:{
        type:String,
        require:true
      },
      _id:{
        type:String,
        require:true,
      },
      address:String, // Redundant address added for efficient retreival
      email:String,  // Redundant email added for efficient retreival
      offChainCreditScore:Number, 
      onChainCreditScore:Number,
      validationHistory:[{reportId:String,postId:String,
        votedAt:Number,
        promoterAddress:String,promoterId:String,
        votedOn:Number,}],

      assignedReport:[{
        reportId:String,postId:String,
        timestamp:Number,
        promoterAddress:String,promoterId:String,
        }],
      missedReports:[String],
      lastCheckIn:Number,
      lastAssignedReportId:String,
      hasRequestedResign:Boolean,
      resignationTime:Number,
      stake:Number,
      isActive:Boolean

},{_id:false})


const reportSchema  = new mongoose.Schema({
     _id:{type:String,require:true},
     advertiserId:String,
     advertiserComment:String,
     hash:String,
     promoterId:String,
     promoterAddress:String,
     postId:String,
     interactionId:String,
     createdOn:Number,
     validatorsVote:[{validatorId:String,validatorAddress:String,isValid:Boolean,comment:String,votedAt:Number}],
     assignedValidators:[String], //Addresses of Assigned Validators
     validVotes:Number,
     invalidVotes:Number,
     isInteractionValid:Boolean,
     hasFinalized:Boolean,
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
     email:String,
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


const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    postHead: String,
    postBody: String,
    postHash: String,
    advertiserID: String,
    targetAudience: [String],
    timestamp: Number,
    rewardPerInteraction: Number,
    maximumInteraction: Number,
    interactionCount: Number,
    postType: {
      type: String,
      required: true,
      enum: ["Ordinary", "Challenge"],
    },
  },
  { discriminatorKey:'postType', _id: false }
);

const postModel = mongoose.model("Post", postSchema);

const OrdinarySchema = postModel.discriminator(
  "Ordinary",
  new mongoose.Schema({
    socialTask: {
      type: Map,
      of: [{ task: String, link: String }],
    },
    interactions: [
      { interactedAt: Number, promoterID: String, interactionID: String },
    ],
  })
);

const ChallengeSchema = postModel.discriminator(
  "Challenge",
  new mongoose.Schema({
    stakeRequired: Number,
    challengeWindow: Number,
    interactions: [
      {
        interactionID: String,
        interactedAt: Number,
        promoterID: String,
        interactionBody: String,
        interactionHash: String,
        imageProofs: [String],
        isChallenged: Boolean,
        claimUnlock: Number,
        hasClaimed: Boolean,
        isValid: Boolean,
      },
    ],
  })
);




const userModel  = mongoose.model('User',userSchema);
const validatorModel  = mongoose.model('Validator',validatorSchema);
const reportModel  = mongoose.model('Report',reportSchema);

module.exports = {userModel,validatorModel,reportModel,postModel};

