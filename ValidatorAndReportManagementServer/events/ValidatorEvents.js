const contract  = require("../models/contractValidator")
const {userModel,validatorModel}  = require("../models/dbModel");
const {nanoid} = require("nanoid")

exports.ListenValidatorEvents = () => { 

//Automatically called when the validator contract emit this event
 contract.on("VALIDATORADDED", async (address,timestamp)=>{
    try {
        address = address.toLowerCase();
        const user  =  await userModel.findOne({address:address}).exec();
        
        await validatorModel.create({
         _id: nanoid(6),   //Validators ID
         profileID:user._id,   //User Profile ID
         email:user.email,
         offChainCreditScore:10,
         onChainCreditScore:10,
         lastCheckIn:Number(timestamp),
         address:address,
      })

      user.isValidator = true;
      await user.save();
      
      }catch(error){ 
        console.log("Error Occured At ValidatorAdded Event  Error Message :"+ error.message);
     }
   })
   
   //Validator Request Resignation, his stake will unlock after 1 day
   contract.on("RESIGN",async (address,timestamp)=>{
        try{
          address = address.toLowerCase();
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.hasRequestedResign = true;
          validator.resignationTime  = Number(timestamp);
         await validator.save();
        }catch(error){ 
          console.log("Error Occured At Resign Event  Error Message :"+ error.message);
        }
   })

   //Delete User Roles as a Validator
   contract.on("UNSTAKE",async (address)=>{
        try{
          address = address.toLowerCase();
          await validatorModel.deleteOne({address:address}).exec();
        }catch(error){ 
          console.log("Error Occured At Resign Event  Error Message :"+ error.message);
        }
   })
  
   contract.on("CHECKIN", async (address,timestamp)=>{
      try{
          address = address.toLowerCase();
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.lastCheckIn = Number(timestamp);
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At Checkin Event  Error Message :"+ error.message);
      }
   })

   contract.on("SLASH", async(address,timestamp,stake)=>{
    try{
          address = address.toLowerCase();
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.lastCheckIn = Number(timestamp);
          validator.stake = stake;
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At SLASH Event  Error Message :"+ error.message);
      }
   })
   
    contract.on("CREDITSCORE", async(address,creditScore)=>{
    try{
          address = address.toLowerCase();
          const validator  = await validatorModel.findOne({address:address}).exec()
          validator.onChainCreditScore = creditScore;
          await validator.save();
      }catch(error){ 
          console.log("Error Occured At Credit Score Event  Error Message :"+ error.message);
      }
   })
   
}