const {
  userModel,
  postModel,
  reportModel,
  validatorModel,
} = require("../models/dbModel");
const contract = require("../models/contractValidator");
const PostContract = require("../models/contractPostB");


//Precondtion, call only after casting vote with the smart contract

exports.castVote = async (req, res) => {
  try {
    const {
      reportId,
      promoterAddress,
      postId,
      userAddress,
      validatorComment,
      isValid,
      hash,
    } = req.body;
    //Checking whether all the params exits
    if (
      !report ||
      !promoterAddress ||
      !postId ||
      !userAddress ||
      !validatorComment ||
      !isValid ||
      !hash
    )
      return res.status(400).json({ message: "Missing Params" });

    const report = await reportModel.findById({ _id: reportId }).exec();
    if (!report)
      return res.status(404).json({ message: "Report Doesnot Exits" });
    
    if(report.createdOn + 86400 < Date.now()/1000)
       return res.status(400).json({ message: "Voting Period Ended" });

    const validator = await validatorModel.findOne({ address: userAddress }).exec();

    if (!validator.assignedReport.find((report) => report.reportId == reportId))
      return res
        .status(400)
        .json({ message: "Validator is not assigned to this report" });

    const voteTime = Date.now()/10000 
    report.validatorsVote.push({
      validatorId:validator._id,validatorAddress:validator.address,isValid:isValid,comment:validatorComment,
      voteAt:voteTime
   });
    if(isValid) report.validVotes++; else report.invalidVotes++;

    await report.save();

    validator.assignedReport = validator.assignedReport.filter((report)=>report.reportId !== reportId)
    
    validator.validationHistory.push({
        reportId:reportId,postId:postId,
        votedAt:voteTime,
        promoterAddress:promoterAddress,
    })
    await validator.save();
    
    res.status(200).json({message:"Your vote is counted, your reward will be sent to your address once it finalized"});
    

  } catch (error) {
    console.log("An Error Occured at Casting Vote," + error.message);
    return res.status(500).json({ message: "Server Encountered an error " });
  }
};
