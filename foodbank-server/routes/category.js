const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createCategory, getCategorys } = require("../controller/category");
const router = express.Router();

router.post('/createcategory', authCheck, createCategory)
router.get('/getcategory',authCheck, getCategorys)

module.exports = router;