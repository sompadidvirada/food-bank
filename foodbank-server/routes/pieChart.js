const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { pieChartSell, pieChartSend, pieChartExp } = require("../controller/pieChart");
const router = express.Router();

router.post('/getpiechartsell', authCheck, pieChartSell)
router.post('/getpiechartsend', authCheck, pieChartSend)
router.post('/getpiechartexp', authCheck, pieChartExp)

module.exports = router;