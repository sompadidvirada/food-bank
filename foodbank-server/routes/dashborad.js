const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { dashboradData } = require("../controller/dashborad");
const router = express.Router();


router.post(`/feashdashborad`, authCheck, dashboradData)


module.exports = router;