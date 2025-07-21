const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createProduct,
  getProducts,
  updatePerBrach,
  updateProduct,
  deleteProduct,
} = require("../controller/products");

{
  /**Upload Section */
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/product_img"); // Store files in 'public/staff_porfile'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

{
  /**route upload */
}
router.post("/createproduct",authCheck,createProduct);


{
  /** ACCESS IMG route */
}

const defaultImage = "";

router.get("/product_img/:imageName", (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "../public/product_img", imageName);

  const sendCachedFile = (filePath) => {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.removeHeader("Last-Modified");
    res.removeHeader("ETag");
    res.sendFile(filePath, {
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    });
  };

  if (fs.existsSync(imagePath)) {
    sendCachedFile(imagePath);
  } else {
    sendCachedFile(path.join(__dirname, defaultImage));
  }
});

{
  /**API routes */
}

router.get("/getallproduct", authCheck, getProducts);
router.put("/updateaviable/:id", authCheck, updatePerBrach);
router.put("/updateproduct/:id", authCheck, updateProduct);
router.delete("/deleteproduct/:id", authCheck, adminCheck, deleteProduct)

module.exports = router;
