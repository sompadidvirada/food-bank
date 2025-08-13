const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createPreorder,
  updateOrderTrack,
  updateOrderWant,
  deleteOrder,
  getPassThreeWeekTrack,
  testData,
  checkOrder,
  getAllORderTrack,
  confirmOrder,
  checkConfirmOrderPerBranch,
  checkConfirmOrderAll,
  changeStatusConfirmOrder,
  confirmOrderChange,
} = require("../controller/preorder");
const router = express.Router();

router.post("/orderinsert", createPreorder);
router.post("/checkorder", checkOrder);
router.put("/updateorder/:id", updateOrderTrack);
router.put("/updateorderwant/:id", updateOrderWant);
router.post("/deleteordertrack",authCheck, deleteOrder);
router.post("/getpreviosorder", getPassThreeWeekTrack);
router.post("/getallordertrack", getAllORderTrack)
router.post("/confirmorder", confirmOrder)
router.post("/checkconfirmperbranch", checkConfirmOrderPerBranch)
router.post("/checkconfirmall", checkConfirmOrderAll)
router.put("/changestatusconfirm/:id",authCheck, changeStatusConfirmOrder)
router.put("/confirmorderchange/:id", confirmOrderChange)

module.exports = router;
