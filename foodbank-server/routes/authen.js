const express = require("express");
const {
  login,
  createStaff,
  currentUser,
  deleteStaff,
  createNewPassword,
} = require("../controller/authen");
const { authCheck, adminCheck, baristarCheck } = require("../middleware/authCheck");
const router = express.Router();


router.post("/login", login);
router.post("/current-user", authCheck, currentUser);
router.post("/createstaff",authCheck, createStaff);
router.post("/current-admin", authCheck, adminCheck, currentUser);
router.post("/current-baristar", authCheck, baristarCheck,currentUser)
router.post("/deletestaff", authCheck, adminCheck, deleteStaff);
router.put("/ceatenewpassword", createNewPassword)

module.exports = router;
