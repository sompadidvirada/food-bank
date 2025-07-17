const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { LineChart } = require("../controller/lineChart");
const router = express.Router();

router.post('/linechart', authCheck, LineChart)

module.exports = router;