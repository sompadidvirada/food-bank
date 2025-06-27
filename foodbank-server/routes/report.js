const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { reportPerBranch, TotalData } = require("../controller/report");
const router = express.Router();


router.post('/reportperbranch',authCheck, reportPerBranch)
router.post('/reportall', authCheck, TotalData)


module.exports = router;