const express = require("express");
const {
  login,
  createStaff,
  currentUser,
  deleteStaff,
  createNewPassword,
} = require("../controller/authen");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/staff_porfile"); // Store files in 'public/staff_porfile'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

router.post("/login", login);
router.post("/current-user", authCheck, currentUser);
router.post("/createstaff",upload.single("profileImage"), authCheck, adminCheck, createStaff);
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.post("/deletestaff", authCheck, adminCheck, deleteStaff);
router.put("/ceatenewpassword", createNewPassword)

module.exports = router;
