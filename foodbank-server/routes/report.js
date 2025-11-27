const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { reportPerBranch, TotalData, reportTreekoffSellDashborad, reportTotalTreekoffDataGrid } = require("../controller/report");
const router = express.Router();


router.post('/reportperbranch',authCheck, reportPerBranch)
router.post('/reportall', authCheck, TotalData)
router.post('/reporttreekoffdashborad', reportTreekoffSellDashborad)
router.post('/reporttotaltreekoff', reportTotalTreekoffDataGrid)


module.exports = router;