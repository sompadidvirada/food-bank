const express = require("express");
const multer = require("multer");
const { login, createStaff, currentUser } = require("../controller/authen");
const router = express.Router();



router.post("/login", login)
router.post("/createstaff", createStaff)
router.post("/current-admin", currentUser)
router.post("/current-user", currentUser)

module.exports = router;