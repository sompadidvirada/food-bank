const express = require("express");
const { authCheck, adminCheck, baristarCheck } = require("../middleware/authCheck");
const { getSellandExpBaristar, getOrderBaristar, createCommentBaristar, getreportBaristar, getAllReport, getReportFilterByStaffId, updateUnreadReportAdmin } = require("../controller/baristar");

const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/profliebaristar', authCheck, baristarCheck, getSellandExpBaristar)
router.post('/getorderbaristar', authCheck, baristarCheck, getOrderBaristar)
router.post('/getreportbaristar', authCheck, getreportBaristar)
router.post('/getallreport', authCheck, getAllReport)
router.get('/getreportbyid/:id', authCheck, getReportFilterByStaffId)
router.post('/updatereportreadbystaff', authCheck, updateUnreadReportAdmin)

router.post(
  "/reportbaristar",
  authCheck,
  upload.array("images"),
  createCommentBaristar
);

module.exports = router;