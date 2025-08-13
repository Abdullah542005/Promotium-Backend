const {
  userModel,
  postModel,
  reportModel,
  validatorModel,
} = require("../models/dbModel");
const PostContract = require("../models/contractPostB");
const promo = require("../models/promo");
const { ethers } = require("ethers");

/*This function is called every hour and it finalize reports that have its voting period
ended or all the validator have voted*/
exports.finalizeReports = async () => {
  const reports = await reportModel.find().exec();

  //Filter all the un finalized reports.
  const uncheckedReports = reports.filter(
    (report) =>
      !report.hasFinalized &&
      (report.createdOn + 86400 < Date.now() / 1000 ||
        report.assignedValidators.length == report.validatorsVote.length)
  );

  if (uncheckedReports.length == 0) return;

  for (const report of uncheckedReports) {
    try {
      await PostContract.finalizeReport(Number(report.postId.split("_")[1]), report.promoterAddress);
    } catch (error) {
      console.log(
        "An Error Occured while exectuing contract's finalize report function,Message: " +
          error.message
      );
    }
    const post = await postModel.findById({ _id: report.postId });
    const interaction = post.interactions.find(
      (interaction) => interaction.promoterID == report.promoterId
    );

    report.hasFinalized = true;
    if (report.invalidVotes <= report.assignedValidators.length / 2) {
      report.isInteractionValid = true;
      interaction.isChallenged = false;
      interaction.claimUnlock = Date.now() / 1000; //Unlocks the claim
      // Push notification to advertiser and promoter
      await userModel.updateOne(
            { address: report.promoterAddress.toLocaleLowerCase()},
            {
              $push: {
                notifications: {
                  type: "Report Finalized",
                  message: `After validators inspection your interaction with Post Id #${report.postId}
                  has been deeemed valid, hence you can claim your reward immediately from your My Interaction
                  tab of your profile.
                  `,
                },
              },
            }
          );

            await userModel.updateOne(
            { _id:report.advertiserId},
            {
              $push: {
                notifications: {
                  type: "Report Finalized",
                  message: `After validators inspection your report of Post Id #${report.postId}
                  against ${report.promoterId} has been deeemed as inValid, you can search the report Id# ${report.id}
                  for validators stance.`,
                },
              },
            }
          )

    } else {
      post.interactionCount--;
      interaction.isValid = false; 
      await userModel.updateOne(
      { address: report.promoterAddress.toLowerCase() },
      {
        $push: {
          notifications: {
            type: "Report Finalized",
            message: `After validators inspection your interaction with Post Id #${report.postId}
            has been deeemed inValid, hence your stake for post is slashed and your interaction is removed.
            Please strickly follow advertisers requirements, before interacting.`,
          },
        },
      }
    );

     await userModel.updateOne(
            { _id:report.advertiserId},
            {
              $push: {
                notifications: {
                  type: "Report Finalized",
                  message: `After validators inspection your report of Post Id #${report.postId}
                  against ${report.promoterId} has been deeemed as Valid, you can search the report Id #${report.id}
                  for validators stance.`,
                },
              },
            }
          )

    }

    post.markModified("interactions");
    await post.save();
    await report.save();

    //If a validator has not voted, punish by reducing its credit Score by One.
    for (const validatorAddress of report.assignedValidators) {
      if (
        !report.validatorsVote.find(
          (vote) => vote.validatorAddress == validatorAddress
        )
      ) {
        const validator = await validatorModel.findOne({
          address: validatorAddress,
        });
        validator.offChainCreditScore--;
        await validator.save();
      }
    }
  }


};
