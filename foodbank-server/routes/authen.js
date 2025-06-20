const express = require("express");
const multer = require("multer");
const { login, createStaff, currentUser } = require("../controller/authen");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const router = express.Router();

router.post("/login", login);
router.post("/createstaff", createStaff);
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.post("/current-user", authCheck, currentUser);

module.exports = router;
