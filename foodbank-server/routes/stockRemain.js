const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createStockRemain,
  getStockRemain,
  deleteAllStockRemain,
  getStockRemainAllItem,
  updateStockRemain,
} = require("../controller/stockRemain");
const router = express.Router();

router.post("/createstockremain", authCheck, createStockRemain);
router.get("/getstockremain", authCheck, getStockRemainAllItem);
router.post("/deletestockremain", authCheck, deleteAllStockRemain);
router.put("/updatestockreamin/:id", authCheck, updateStockRemain)

module.exports = router;
