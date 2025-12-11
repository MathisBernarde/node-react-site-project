const { Router } = require("express");
const RecipeController = require("../controllers/recipes");
const checkAuth = require("../middlewares/check-auth");

const router = Router();

router.get("/recipes", checkAuth, RecipeController.cget);
router.post("/recipes", checkAuth, RecipeController.create);

router.get("/recipes/:id", checkAuth, RecipeController.get);
router.patch("/recipes/:id", checkAuth, RecipeController.update);
router.delete("/recipes/:id", checkAuth, RecipeController.delete);

module.exports = router;