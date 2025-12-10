const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/check-auth");
const checkRole = require("../middlewares/check-role");
const router = Router();

router.get("/users", checkAuth, checkRole({ role: "ADMIN" }), UserController.cget);

router.post("/users", UserController.create);

router.get(
  "/users/:id",
  checkAuth,
  checkRole({ role: "ADMIN", selfAccess: true }),
  UserController.get
);

router.patch(
  "/users/:id",
  checkAuth,
  checkRole({ role: "ADMIN", selfAccess: true }),
  UserController.patch
);

router.delete(
  "/users/:id",
  checkAuth,
  checkRole({ role: "ADMIN", selfAccess: true }),
  UserController.delete
);

module.exports = router;
