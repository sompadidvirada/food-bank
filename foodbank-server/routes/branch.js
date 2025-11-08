const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createBranch, getBranchs, updateBranchLocation, updateBranchProvice, cleanAviable, changePhonenumber } = require("../controller/branch");
const router = express.Router();

router.post('/createbranch', authCheck, createBranch)
router.get('/getallbranch', authCheck, getBranchs)
router.put('/updatebranchlocation/:id', authCheck, updateBranchLocation)
router.put('/updateprovince', authCheck, adminCheck, updateBranchProvice)
router.post('/cleanupaviable', cleanAviable)
router.post('/changephonenumber', authCheck, changePhonenumber)


module.exports = router;