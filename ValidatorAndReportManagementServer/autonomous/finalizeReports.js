const {
  userModel,
  postModel,
  reportModel,
  validatorModel,
} = require("../models/dbModel");
const PostContract = require("../models/contractPostB");

/*This function is called every hour and it finalize reports that have its voting period
ended or all the validator have voted*/
exports.finalizeReports = async ()=>{

    const reports = await reportModel.find().exec();

    //Filter all the un finalized reports. 
    const uncheckedReports = reports.filter((report)=>
     !report.hasFinalized && (report.createdOn + 86400  < Date.now()/1000 || 
     report.assignedValidators.length == report.validatorsVote.length
     ))
    
     if(uncheckedReports.length == 0)
      return;

     for (const report of uncheckedReports){ 
        try{
         await PostContract.finalizeReport(report.postId,report.promoterAddress);
        }catch(error){
           console.log("An Error Occured while exectuing contract's finalize report function,Message: " + error.message)
        }
        const post  = await postModel.findById({_id:report.postId})
        const interaction = post.interactions.find(
                 (interaction) => interaction.promoterID == report.promoterId  );
          
        report.hasFinalized  = true;
        if(report.invalidVotes <= report.assignedValidators.length/2){
          report.isInteractionValid = true;
          interaction.isChallenged = false;
          interaction.claimUnlock = Date.now()/1000; //Unlocks the claim
        }else{ 
          post.interactionCount--;
          interaction.isValid = false; // The interaction is set to invalid, though it is deleted from the blockchain.   
        }
         post.markModified("interactions");
         await post.save();
         await report.save();

         //If a validator has not voted, punish by reducing its credit Score by One.
        for (const validatorAddress of report.assignedValidators){
                if(!report.validatorsVote.find((vote)=>vote.validatorAddress == validatorAddress)){
                  const validator = await validatorModel.findOne({address:validatorAddress})
                  validator.offChainCreditScore--;
                  await validator.save();
                }
         }
         
        //Code Remaining to reward all the validators.

     }
     
}