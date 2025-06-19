const express = require("express");
const multer = require("multer");
const { login, createStaff } = require("../controller/authen");
const router = express.Router();



router.get("/login", login)
router.post("/createstaff", createStaff)

module.exports = router;