const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createBranch, getBranchs } = require("../controller/branch");
const router = express.Router();

router.post('/createbranch', authCheck, adminCheck, createBranch)
router.get('/getallbranch', authCheck, getBranchs)


module.exports = router;