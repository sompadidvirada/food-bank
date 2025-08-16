const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createCategoryMaterial,
  getCategoryMaterial,
  updateCategoryMaterial,
  deleteCategoryMaterial,
  createRawMaterial,
  createRawmaterialVariant,
} = require("../controller/material");
const router = express.Router();

//categoryMaterial

router.post("/createcategorymaterial", authCheck, createCategoryMaterial);
router.get("/getcategorymaterial", authCheck, getCategoryMaterial);
router.put("/updatecategorymaterial/:id", authCheck, updateCategoryMaterial);
router.post(
  "/deletecategorymaterial/:id",
  authCheck,
  adminCheck,
  deleteCategoryMaterial
);

// raw material

router.post("/createrawmaterial", authCheck, createRawMaterial)
router.post("/createRawmaterialVariant", authCheck, createRawmaterialVariant)

module.exports = router;
