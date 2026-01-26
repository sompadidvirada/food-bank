const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { createSuppler, getAllSupplter } = require("../controller/suppler");
const router = express.Router();

router.post("/createsuppler", authCheck, createSuppler)
router.get("/getallsupplyer", authCheck, getAllSupplter)

module.exports = router;