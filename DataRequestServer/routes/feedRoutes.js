const express = require("express");
const router = express.Router();
const feedController = require('../controllers/feedController');
const getPostController = require('../controllers/getPost');
const getUserController = require('../controllers/getUser');
const {search} =  require("../controllers/search")
const {generalFeed} =  require("../controllers/gFeed")
const {getContract}  = require("../controllers/getContracts");
const {getValidator} = require("../controllers/getValidator");
const {getUserNotifications} = require("../controllers/getUserNotifications");

router.get("/feed/:timestamp", generalFeed);

router.get("/post/:id", getPostController.getPost);

router.get("/user/:id", getUserController.getUser);

router.get("/contracts",getContract)

router.post('/search', search)

router.post('/validator', getValidator);

router.get('/notifications', getUserNotifications);

module.exports = router;