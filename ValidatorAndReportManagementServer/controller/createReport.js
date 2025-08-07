const {
  userModel,
  postModel,
  reportModel,
  validatorModel,
} = require("../models/dbModel");
const ValidatorContract = require("../models/contractValidator");
const ethers = require("ethers");
const PostContract = require("../models/contractPostB");
const { generateid } = require("../utils/generateid");
const Chance = require("chance");
const contract = require("../models/contractValidator");
const transporter = require("../services/emailTransporter")
const mail = require("../models/reportAssignmentmail")
require("dotenv").config();

/* Precondition :- the report metadata must be stored in the contract before calling this function
 */

exports.createReport = async (req, res) => {
  try {
    const { postId, userAddress, promoterAddress, advertiserComment } = req.body;
    const user = await userModel.findOne({ address: userAddress.toLowerCase() }).exec();
    const post = await postModel.findById({ _id: postId }).exec();
    const promoterUser = await userModel.find({ address:promoterAddress.toLowerCase() }).exec();
    if (!user)
      return res.status(400).json({ message: "Your Account Doesnot Exits" });
    if (!post) return res.status(400).json({ message: "Invalid Post ID" });
    if (post.advertiserId != user._id)
      return res
        .status(400)
        .json({ message: "You are not the owner of this post" });

    const reportMetadata = await PostContract.reports(
       Number(postId.split("_")[1]),
       promoterUser.address
    );

    if (reportMetadata.timestamp == 0)
      return res.status(400).json({
        message: "Precondition of storing metadata in the contract fails",
      });

    const doesReportExits = await reportModel.findOne({ promoterId: promoterId });

    if (doesReportExits)
      return res.status(400).json({
        message:
          "Report against current promoter already exits in the database",
      });

    const interaction = post.interactions.find(
      (interaction) => interaction.promoterID == promoterId
    );
    interaction.isChallenged = true;
    post.markModified("interactions");
    await post.save();

    const reportId = generateid();
    await reportModel.insertOne({
      _id: reportId,
      advertiserId: user._id,
      advertiserComment: advertiserComment,
      hash: ethers.sha256(ethers.toUtf8Bytes(advertiserComment)), //Hashing Advertisor Comment
      promoterId: promoterUser._id,
      promoterAddress:promoterUser.address,
      postId: post._id,
      interactionId: interaction.interactionId,
      createdOn: reportMetadata.timestamp,
      validVotes: 0,     //Interaction is Valid
      invalidVotes: 0,  //Interaction is Invalid
      isInteractionValid: true,
      hasFinalized:false,
    });

    res.json({
      message:
        "Your Report has been successfully stored, Validators will cast there vote within next 24 hours",
    });

    // Assiging Validators To Report

    const validators = await validatorModel.find().exec();

    // Filter all the validators who are inactive and not elligible
    const filtererdVailidators = validators.filter(
      (validator) =>
        !validator.hasRequestedResign &&
        validator.onChainCreditScore > 5 &&
        validator.offChainCreditScore > 5 &&
        validator.stake > ethers.parseEther("5")
    );

    // Calculates Weight on basis on offchain + onchain credit Score.
    const weights = filtererdVailidators.map(
      (validator) =>
        validator.offChainCreditScore + validator.onChainCreditScore
    );
    const chance = new Chance();
    const selectedValidators = [];

    // Randomly Selects 5 validators from a pool of more than more than 5 validators
    if (filtererdVailidators.length > 5)
      while (selectedValidators.length != 5) {
        const validator = chance.weighted(filtererdVailidators, weights);
        if (!selectedValidators.includes(validator))
          selectedValidators.push(validator);
      }
    else selectedValidators.push(...filtererdVailidators);

    const validatorAddress = selectedValidators.map(
      (validators) => validators.address
    );

    const report = await reportModel.findById({_id:reportId})
    await report.assignedValidators.push(...validatorAddress).save();

    // Assigning Validators to the report in the contract
    await contract.assignValidators(
      Number(postId.split("_")[1]),
      promoterUser,
      validatorAddress
    );
     
    //Sending Notifications Emails to Validators 
    selectedValidators.forEach(async (validator)=> {
       validator.assignedReport.push({
        reportId:reportId,postId:postId,
        timestamp: reportMetadata.timestamp,
        promoterAddress:promoterUser.address,promoterId:promoterUser._id,
        intreactionId:interaction._id
       })
       await validator.save();
       await  transporter.sendMail(mail(validator.email,reportId,promoterId,promoterUser.address,postId))
    })
        
    //Dapp Notifications Added
    await userModel.updateOne(
      { address: userAddress },
      {
        $push: {
          notifications: {
            type: "Report Created",
            message: `Your report against ${promoterUser.username} has been created successfully.`,
          },
        },
      }
    );

  } catch (error) {
    console.log("Error at Create Report, Message :" + error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

