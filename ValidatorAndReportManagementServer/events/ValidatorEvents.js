const contract  = require("../models/contractValidator")
const {userModel,validatorModel}  = require("../models/dbModel");
const { generateid } = require("../utils/generateid");

exports.ListenValidatorEvents = () => { 

//Automatically called when the validator contract emit this event
 contract.on("VALIDATORADDED", async (address,timestamp)=>{

    try {
        const user  =  await userModel.findOne({address:address}).exec();
        await validatorModel.insertOne({
         _id: generateid(),   //Validators ID
         profileID:user._id,   //User Profile ID
         email:user.email,
         offChainCreditScore:10,
         onChainCreditScore:10,
         lastCheckIn:timestamp,
         address:address,
      }).exec()

      user.isValidator = true;
      await user.save();
      
      }catch(error){ 
        console.log("Error Occured At ValidatorAdded Event  Error Message :"+ error.message);
     }
   })
   
   //Validator Request Resignation, his stake will unlock after 1 day
   contract.on("RESIGN",async (address,timestamp)=>{
        try{
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.hasRequestedResign = true;
          validator.resignationTime  = timestamp;
         await validator.save();
        }catch(error){ 
          console.log("Error Occured At Resign Event  Error Message :"+ error.message);
        }
   })

   //Delete User Roles as a Validator
   contract.on("UNSTAKE",async (address)=>{
        try{
          await validatorModel.deleteOne({address:address}).exec();
        }catch(error){ 
          console.log("Error Occured At Resign Event  Error Message :"+ error.message);
        }
   })
  
   contract.on("CHECKIN", async (address,timestamp)=>{
      try{
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.lastCheckIn = timestamp;
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At Checkin Event  Error Message :"+ error.message);
      }
   })

   contract.on("SLASH", async(address,timestamp,stake)=>{
    try{
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.lastCheckIn = timestamp;
          validator.stake = stake;
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At SLASH Event  Error Message :"+ error.message);
      }
   })
   
    contract.on("CREDITSCORE", async(address,creditScore)=>{
    try{

          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.onChainCreditScore = creditScore;
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At Credit Score Event  Error Message :"+ error.message);
      }
   })
   
}