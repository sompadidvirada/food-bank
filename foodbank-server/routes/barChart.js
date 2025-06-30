const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { getBarChartSell, getBarChartSend, getBarChartExp } = require("../controller/barChart");
const router = express.Router();

router.post('/barsell', authCheck, getBarChartSell)
router.post('/barsend', authCheck, getBarChartSend)
router.post('/barexp', authCheck, getBarChartExp)

module.exports = router;