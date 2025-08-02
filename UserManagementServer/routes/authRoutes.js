const express = require("express");
const router = express.Router();

const { getNonce } = require("../controllers/getNonce");
const { login } = require("../controllers/loginController");
const { createAccount } = require("../controllers/createAccount");
const { authorization } = require("../middleware/authorization");
const { checkUserName } = require("../controllers/checkUsername");
const { checkSocialMedia } = require("../controllers/checkSocialMedia");
const { clearNotifications } = require("../controllers/clearNotifications");
router.get("/getNonce/:userAddress", getNonce);

router.post("/login", login);

router.get("/checkUserName/:userName", checkUserName);

router.post("/checkSocialMedia", checkSocialMedia);

router.post("/createAccount", authorization, createAccount);

router.delete("/clearNotifications/:username", clearNotifications);

module.exports = router;
