const express = require("express");
const { authCheck, adminCheck, baristarCheck } = require("../middleware/authCheck");
const { getSellandExpBaristar, getOrderBaristar } = require("../controller/baristar");
const router = express.Router();

router.post('/profliebaristar', authCheck, baristarCheck, getSellandExpBaristar)
router.post('/getorderbaristar', authCheck, baristarCheck, getOrderBaristar)

module.exports = router;