const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/check-auth");
const checkRole = require("../middlewares/check-role");
const router = Router();

router.post("/users", UserController.create);
router.get("/users", checkAuth, checkRole(["ADMIN"]), UserController.cget);
router.get("/users/:id", checkAuth, checkRole(["ADMIN"]), UserController.get);
router.patch("/users/:id", checkAuth, checkRole(["ADMIN"]), UserController.patch || UserController.update);
router.delete("/users/:id", checkAuth, checkRole(["ADMIN"]), UserController.delete);

module.exports = router;