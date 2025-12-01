const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { reportPerBranch, TotalData, reportTreekoffSellDashborad, reportTotalTreekoffDataGrid, getReportCoffeeSellByName, getCoffeeSellMenuFromType } = require("../controller/report");
const router = express.Router();


router.post('/reportperbranch',authCheck, reportPerBranch)
router.post('/reportall', authCheck, TotalData)
router.post('/reporttreekoffdashborad', reportTreekoffSellDashborad)
router.post('/reporttotaltreekoff', reportTotalTreekoffDataGrid)
router.post('/getcoffeesellbyname', getReportCoffeeSellByName)
router.post('/reportcoffeesellbytype', getCoffeeSellMenuFromType)


module.exports = router;