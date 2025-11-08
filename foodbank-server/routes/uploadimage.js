const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware/authCheck");
const multer = require("multer");
const { uploadProductImage, checkUploadImageAllBranch } = require("../controller/uploadimage");

const storage = multer.memoryStorage();

const upload = multer({ storage });

// routes.js or your route definition
router.post("/upload-s3", uploadProductImage);
router.post("/getimageallbranch",authCheck, checkUploadImageAllBranch);

module.exports = router;
