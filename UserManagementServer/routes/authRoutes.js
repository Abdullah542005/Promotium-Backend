const express = require("express");
const router = express.Router();

const { getNonce } = require("../controllers/getNonce");
const { login } = require("../controllers/loginController");

router.get("/getNonce/:userAddress", getNonce);

router.post("/login", login);

module.exports = router;
