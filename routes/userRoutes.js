import express from "express";
import userController from "../controller/userController";
import middleware from "../middleware/isAuth";
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/register", userController.register);
router.post("/signin", userController.login);
router.get("/profile", middleware.verifyToken, userController.profile);
router.post(
  "/change-password",
  middleware.verifyToken,
  userController.changePassword
);
router.post("/logout", middleware.verifyToken, userController.logout);

module.exports = router;
