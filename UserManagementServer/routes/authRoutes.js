const express = require("express");
const router = express.Router();

const { getNonce } = require("../controllers/getNonce");
const { login } = require("../controllers/loginController");
const { createAccount } = require("../controllers/createAccount");
const { authorization } = require("../middleware/authorization");
const { checkUserName } = require("../controllers/checkUsername");
const { checkSocialMedia } = require("../controllers/checkSocialMedia");

router.get("/getNonce/:userAddress", getNonce);

router.post("/login", login);

router.post("/checkUserName", checkUserName);

router.post("/checkSocialMedia", checkSocialMedia);

router.post("/createAccount", authorization, createAccount);

module.exports = router;
