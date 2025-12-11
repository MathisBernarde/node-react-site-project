const express = require("express");
const router = express.Router();

// On importe le contrôleur qu'on vient de créer
const ingredientController = require("../controllers/ingredient"); 

// Définition des adresses
router.get("/ingredients", ingredientController.getAllIngredients); // Voir la liste
router.post("/ingredients", ingredientController.createIngredient); // En créer un
router.put("/ingredients/:id", ingredientController.updateIngredient); // Modifier

module.exports = router;