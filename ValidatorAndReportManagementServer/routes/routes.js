const express  = require("express")
const {castVote}  = require("../controller/castVote")
const {createReport} = require("../controller/createReport");
const {authorization} = require("../middleware/authorization")
const router  = express.Router();

router.post("/castVote",authorization,castVote);
router.post("/createReport",authorization,createReport);

module.exports = router;

