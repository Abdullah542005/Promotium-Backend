
require("dotenv").config();

exports.mail = (email,reportId,promoterId,promoterAddress,postId) => {
      return {
        from: process.env.EMAIL,
        to: email,
        subject: "Report Assignment Notification – Action Required",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear Validator,</p>
      <p>
        You have been assigned to review <strong>Report (ID: ${reportId})</strong>, which has been submitted against 
        <strong>Promoter (ID: ${promoterId}, Address: ${promoterAddress})</strong> concerning their interaction with 
        <strong>Post (ID: ${postId})</strong>.
      </p>
      <p>
        Please verify the reported interaction and cast your vote within the next <strong>24 hours</strong>
        from your reports tab in promotium dapp. Timely participation is essential to maintain your 
        <strong>credit score</strong> and remain eligible for <strong>voting rewards</strong>.
      </p>
      <p>Thank you for your contribution to maintaining the integrity of the platform.</p>
      <p>Best regards,<br/>Promotium Protocol</p>
    </div>
  `,};};
    
