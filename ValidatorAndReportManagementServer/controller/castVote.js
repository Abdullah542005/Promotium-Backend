const {
  userModel,
  postModel,
  reportModel,
  validatorModel,
} = require("../models/dbModel");
const contract = require("../models/contractValidator");
const PostContract = require("../models/contractPostB");

// Precondition: call only after casting vote with the smart contract
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

    // Check whether all params exist
    if (
      !reportId ||
      !promoterAddress ||
      !postId ||
      !userAddress ||
      !validatorComment ||
      isValid === undefined || // must check for boolean properly
      !hash
    ) {
      return res.status(400).json({ message: "Missing Params" });
    }

    const report = await reportModel.findById(reportId).exec();
    if (!report) {
      return res.status(404).json({ message: "Report Does Not Exist" });
    }

    if (report.createdOn + 86400 < Date.now() / 1000) {
      return res.status(400).json({ message: "Voting Period Ended" });
    }

    const validator = await validatorModel.findOne({ address: userAddress.toLowerCase() }).exec();
    if (
      !validator.assignedReport.find((report) => report.reportId == reportId)
    ) {
      return res.status(400).json({ message: "Validator is not assigned to this report" });
    }

    const voteTime = Math.floor(Date.now() / 1000);

    // Add vote details to report
    report.validatorsVote.push({
      validatorId: validator._id,
      validatorAddress: validator.address,
      isValid: isValid,
      comment: validatorComment,
      voteAt: voteTime,
    });
    if (isValid) report.validVotes++;
    else report.invalidVotes++;

    await report.save();

    // Update validator details
    validator.assignedReport = validator.assignedReport.filter(
      (report) => report.reportId !== reportId
    );

    validator.validationHistory.push({
      reportId: reportId,
      postId: postId,
      votedAt: voteTime,
      promoterAddress: promoterAddress,
    });
    await validator.save();


    // 1. Notify Validator
    await userModel.updateOne(
      { address: userAddress },
      {
        $push: {
          notifications: {
            type: "Vote Casted",
            message: `Your vote on report ${reportId} for post ${postId} has been recorded.`,
          },
        },
      }
    );

    // 2. Notify Promoter (report owner)
    await userModel.updateOne(
      { address: promoterAddress },
      {
        $push: {
          notifications: {
            type: "New Vote",
            message: `A validator has voted on your report ${reportId} for post ${postId}.`,
          },
        },
      }
    );


    res.status(200).json({
      message: "Your vote is counted, your reward will be sent to your address once finalized",
    });
  } catch (error) {
    console.log("An Error Occurred at Casting Vote," + error.message);
    return res.status(500).json({ message: "Server Encountered an error" });
  }
};
