const express = require("express");
const {authorization} = require("../middleware/authorization");
const {createPostA} = require("../controller/createPostA");
const {createPostB} = require("../controller/createPostB");
const {interactPostA} = require("../controller/interactPostA");
const {interactPostB} = require("../controller/interactPostB");
const {deletePostA }= require("../controller/deletePostA");
const {deletePostB} = require("../controller/deletePostB");
const {claimRewardsPostB} = require("../controller/claimRewardPostB");
const {XAuthInterface} = require("../controller/XAuthInterface");
const router = express.Router();




router.post("/createposta", authorization, createPostA);
router.post("/createpostb", authorization, createPostB);
router.post("/interactposta", authorization, interactPostA);
router.post("/interactpostb", authorization, interactPostB);
router.post("/deleteposta", authorization, deletePostA);
router.post("/deletepostb", authorization, deletePostB);
router.post("/claimreward", authorization, claimRewardsPostB);
router.get("/xauth", XAuthInterface); // XAuth interface for Twitter OAuth
module.exports = router;
