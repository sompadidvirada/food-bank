const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createCoffeeMenu,
  getAllCoffeeMenu,
  updateCoffeeMenu,
  getUploadUrl,
  getCoffeeMenuIngredientByCoffeeMenu,
  updateCoffeeMenuIngredient,
  deleteCoffeeMenuIngredient,
  createCoffeeMenuIngredient,
  deleteCoffeeMenu,
  getMaterialVariantChildOnly,
  createCoffeeSell,
  checkCoffeeSell,
  deleteAllTheCoffeeSellByDate,
  updateCoffeeSell,
  fetchCoffeeSellWithStockRequisition,
  fetchCoffeeIngredientUseByMaterialId,
} = require("../controller/coffee");
const router = express.Router();

//MANAGE COFFEE MENU ROUTE

router.post("/createcoffeemenu", authCheck, createCoffeeMenu);
router.get("/createcoffeemenu", authCheck, getAllCoffeeMenu);
router.put("/updatecoffeemenu/:id", authCheck, updateCoffeeMenu);
router.delete("/deletecoffeemenu/:id", authCheck, adminCheck, deleteCoffeeMenu);

//COFEE INGREDIENT ROUTE

router.post(
  "/createcoffeemenuingredient",
  authCheck,
  createCoffeeMenuIngredient
);
router.post("/uploadimagecoffeemenu", authCheck, getUploadUrl);
router.get(
  "/getcoffeemenuingredient/:id",
  authCheck,
  getCoffeeMenuIngredientByCoffeeMenu
);
router.put(
  "/updatecoffeemenuingredient/:id",
  authCheck,
  updateCoffeeMenuIngredient
);
router.delete(
  "/deletecoffeemenuingredient/:id",
  authCheck,
  deleteCoffeeMenuIngredient
);
router.get(
  "/getmarialvarinatchildonly",
  authCheck,
  getMaterialVariantChildOnly
);

//COFFEE SELL ROUTE

router.post("/insertcoffeesell", authCheck, createCoffeeSell);
router.post("/checkcoffeesell", authCheck, checkCoffeeSell);
router.put("/updatecoffeesell/:id", authCheck, updateCoffeeSell);
router.post("/deletecoffeesellbydate", authCheck, deleteAllTheCoffeeSellByDate);


// COFFEE SELL REPROT 

router.post("/coffeeingredientusereport", authCheck, fetchCoffeeSellWithStockRequisition)
router.post("/getingredientusecompare", authCheck, fetchCoffeeIngredientUseByMaterialId)

module.exports = router;
