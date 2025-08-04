const express = require("express");
const router = express.Router();
const feedController = require('../controllers/feedController');
const getPostController = require('../controllers/getPost');
const getUserController = require('../controllers/getUser');
const {search} =  require("../controllers/search")
const {generalFeed} =  require("../controllers/gFeed")
const {getContract}  = require("../controllers/getContracts");

router.get("/feed/:timestamp", generalFeed);

router.get("/post/:id", getPostController.getPost);

router.get("/user/:id", getUserController.getUser);

router.get("/contracts",getContract)

router.post('/search', search)

module.exports = router;