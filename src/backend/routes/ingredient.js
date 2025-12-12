const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient");
const checkAuth = require("../middlewares/check-auth");

router.get("/ingredients", ingredientController.getAllIngredients);
router.post("/ingredients", checkAuth, ingredientController.createIngredient); 
router.put("/ingredients/:id", checkAuth, ingredientController.updateIngredient);

module.exports = router;