const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const { getStaffInfos, updateBranchStaff, updateStatusStaff, updateRoleStaff, updateMainStaff, clearPasswordStaff } = require("../controller/staffManage");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/staff_porfile"); // Store files in 'public/staff_porfile'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

router.get('/getstaffsinfo', authCheck, adminCheck, getStaffInfos)
router.put('/updatestaff/:id', authCheck, adminCheck, updateBranchStaff)
router.put('/updatestatusstaff/:id', authCheck, adminCheck, updateStatusStaff)
router.put('/updaterolestaff/:id', authCheck, adminCheck, updateRoleStaff)
router.put('/updateuser/:id', updateMainStaff)
router.put('/clearpassword/:id', authCheck, adminCheck, clearPasswordStaff)


{/** GET IMAGES STAFF ROUTE */}

const defaultImage = "public/staff_porfile/default-image.JPG"; // Default image path

router.get("/staffimage/:imageName", (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "../public/staff_porfile", imageName);

  const sendCachedFile = (filePath) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.removeHeader("Last-Modified");
    res.removeHeader("ETag");
    res.sendFile(filePath, { headers: { "Cache-Control": "public, max-age=31536000, immutable" } });
  };

  if (fs.existsSync(imagePath)) {
    sendCachedFile(imagePath);
  } else {
    sendCachedFile(path.join(__dirname, defaultImage));
  }
});



module.exports = router;

