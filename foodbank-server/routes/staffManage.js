const express = require("express");
const router = express.Router();
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { getStaffInfos, updateBranchStaff, updateStatusStaff } = require("../controller/staffManage");


router.get('/getstaffsinfo', authCheck, adminCheck, getStaffInfos)
router.put('/updatestaff/:id', authCheck, adminCheck, updateBranchStaff)
router.put('/updatestatusstaff/:id', authCheck, adminCheck, updateStatusStaff)



module.exports = router;

