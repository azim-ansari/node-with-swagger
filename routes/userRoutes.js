import express from "express";
import { verifyToken } from "../middleware/isAuth";
import {
	register,
	login,
	profile,
	changePassword,
	logout,
	forgotPassword,
	resetPassword,
	updateProfile,
} from "../controller/userController";
// import userController from "../controller/userController";

var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.send("respond with a resource");
});
router.get("/forgot-password", function (req, res, next) {
	res.render("forgot-password");
});
router.get("/reset-password/:userId/:token", function (req, res, next) {
	res.render("reset-password");
});
router.post("/register", register);
router.post("/signin", login);
router.get("/profile", verifyToken, profile);
router.put("/update-profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:userId/:token", resetPassword);
router.post("/logout", verifyToken, logout);

export default router;
