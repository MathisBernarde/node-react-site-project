const { Router } = require("express");
const ShoppingListController = require("../controllers/shoppingList");
const checkAuth = require("../middlewares/check-auth");
const router = Router();
router.use(checkAuth);
router.get("/shopping-lists", ShoppingListController.cget);
router.post("/shopping-lists", ShoppingListController.create);
router.patch("/shopping-lists/:id", ShoppingListController.update);
router.delete("/shopping-lists/:id", ShoppingListController.delete);

module.exports = router;