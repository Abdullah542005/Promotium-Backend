const express = require("express");
const router = express.Router();

const { getNonce } = require("../controllers/getNonce");
const { login } = require("../controllers/loginController");
const { createAccount } = require("../controllers/createAccount");
const { authorization } = require("../middleware/authorization");
const { checkUserName } = require("../controllers/checkUsername");
const { checkSocialMedia } = require("../controllers/checkSocialMedia");
const { clearNotifications } = require("../controllers/clearNotifications");
const {checkToken} = require("../controllers/checkToken")
const {getEmailOtp}  = require("../controllers/getEmailOtp")
const {verifyOTP} = require("../controllers/verifyEmailOtp")
const {setBio} = require("../controllers/setBio")



router.get("/getNonce/:userAddress", getNonce);
router.post('/checktoken', checkToken);

router.post("/getemailotp", authorization, getEmailOtp);
router.post("/verifyemailotp",authorization,verifyOTP);
router.post("/login", login);
router.get("/checkUserName/:userName", checkUserName);

router.post("/checkSocialMedia", checkSocialMedia);
router.post("/setBio", setBio)

router.post("/createAccount", authorization, createAccount);

router.post("/clearNotifications/:address",authorization, clearNotifications);

module.exports = router;
