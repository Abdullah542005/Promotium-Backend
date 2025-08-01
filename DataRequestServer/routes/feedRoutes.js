const express = require("express");
const router = express.Router();
const feedController = require('../controllers/feedController');
const getPostController = require('../controllers/getPost');
const getUserController = require('../controllers/getUser');
router.get("/feed", feedController.getFeed);

router.get("/post/:id", getPostController.getPost);

router.get("/user/:id", getUserController.getUser);

module.exports = router;