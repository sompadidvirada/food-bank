const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { checkTrackSell } = require("../controller/tracking");
const router = express.Router();

router.post('/checktracksell', authCheck, checkTrackSell)
router.post('/checktracksend', authCheck)
router.post('/checktrackexp', authCheck)


module.exports = router;