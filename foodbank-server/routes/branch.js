const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createBranch, getBranchs, updateBranchLocation } = require("../controller/branch");
const router = express.Router();

router.post('/createbranch', authCheck, adminCheck, createBranch)
router.get('/getallbranch', authCheck, getBranchs)
router.put('/updatebranchlocation/:id', authCheck, adminCheck, updateBranchLocation)


module.exports = router;