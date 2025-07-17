const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createBranch, getBranchs, updateBranchLocation, updateBranchProvice } = require("../controller/branch");
const router = express.Router();

router.post('/createbranch', authCheck, adminCheck, createBranch)
router.get('/getallbranch', authCheck, getBranchs)
router.put('/updatebranchlocation/:id', authCheck, adminCheck, updateBranchLocation)
router.put('/updateprovince', authCheck, adminCheck, updateBranchProvice)


module.exports = router;