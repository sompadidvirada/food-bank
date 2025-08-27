const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createCategoryMaterial,
  getCategoryMaterial,
  updateCategoryMaterial,
  deleteCategoryMaterial,
  createRawMaterial,
  createRawmaterialVariant,
  insertStockRequition,
  getMaterialVariant,
  getRawMaterial,
  getUploadUrl,
  getMaterialVariantFromId,
  updateRawMaterial,
  deleteRawMaterial,
  deleteMaterialVariant,
  updateMaterialVariant,
  getStockRequisitionHistory,
  getRawMaterialVariant,
  checkStockRequisitionByDate,
  updateStockRequisition,
  deleteAllStockRequisitionByDate,
  getStockRequisitionAllItem,
  calculatePriceKipByExchangeRate,
  updateMaterialVariantByExchangeRate,
} = require("../controller/material");
const router = express.Router();

//categoryMaterial

router.post("/createcategorymaterial", authCheck, createCategoryMaterial);
router.get("/getcategorymaterial", authCheck, getCategoryMaterial);
router.put("/updatecategorymaterial/:id", authCheck, updateCategoryMaterial);
router.post(
  "/deletecategorymaterial",
  authCheck,
  adminCheck,
  deleteCategoryMaterial
);

// raw material

router.post("/createrawmaterial", authCheck, createRawMaterial);
router.post("/uploadimagerawmaterial", authCheck, getUploadUrl)
router.get('/getallrawmaterial', authCheck, getRawMaterial)
router.post("/createRawmaterialVariant", authCheck, createRawmaterialVariant);
router.post("/insertstockrequition", authCheck, insertStockRequition);
router.post("/getmaterialrequisition", getMaterialVariant);
router.get("/getmetarialvariantfromid/:id", authCheck, getMaterialVariantFromId)
router.put("/updaterawmaterial/:id", authCheck, updateRawMaterial)
router.delete("/deleterawmaterial/:id", authCheck, adminCheck, deleteRawMaterial)
router.delete("/deletematerialvariant/:id", authCheck, deleteMaterialVariant)
router.put("/updatematerialvariant/:id", authCheck, updateMaterialVariant)
router.post("/getstockrequisition", authCheck, getStockRequisitionHistory)
router.get("/getRawMaterialVariant", getRawMaterialVariant)


// stockrequisition
router.post("/getstockrequisitionbydate", authCheck, checkStockRequisitionByDate)
router.post("/getstockrequisitionall", authCheck, getStockRequisitionAllItem)
router.put("/updatestockrequisition/:id", authCheck, updateStockRequisition)
router.post("/deleteallstockrequisitionusedate", authCheck, deleteAllStockRequisitionByDate)


// exchangeRate 

router.post("/exchangeratecalcu",authCheck, updateMaterialVariantByExchangeRate)

module.exports = router;
