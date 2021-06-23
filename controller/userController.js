import userJoi from "../validation/userValidation";
import {
	register,
	findUserByEmail,
	updateUserByEmail,
	logout,
	getUserProfile,
	changePassword,
	resetPassword,
	updateProfile,
	updateProfilePic,
} from "../services/userServices";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { removeKeys } from "../utils/removeKeys";
import { comparePassword } from "../utils/compare";
import { sendMailHtml } from "../utils/sendEmail";
import path from "path";

module.exports = {
	register: async (req, res) => {
		try {
			const value = await userJoi.validateAsync(req.body);
			const user = await findUserByEmail(req.body.email);
			if (user) {
				return res.status(421).json({ message: "User Registered already!!" });
			}
			const userInfo = await register(value);
			const newUser = await removeKeys(userInfo._doc, "password", "updatedAt", "__v");
			res.status(201).json({ message: "Registered successfuly", user: newUser });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error" });
		}
	},

	login: async (req, res) => {
		try {
			const user = await findUserByEmail(req.body.email);
			if (!user) {
				return res.status(404).json({ message: "User Not Registered" });
			} else {
				const match = await comparePassword(user.password, req.body.password);
				if (match == false) {
					return res.status(421).json({ message: "Invalid Credential, Try again!!" });
				} else {
					const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
					const userData = await updateUserByEmail(req.body.email, {
						userToken: token,
						tokenExpiresIn: Date.now() + 60 * 30 * 1000,
					});
					const LoginData = removeKeys(userData._doc, "password", "tokenExpiresIn", "__v");
					return res.status(200).json({ message: "LoggedIn successfully", LoginData });
				}
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error" });
		}
	},

	profile: async (req, res) => {
		try {
			const userId = req.user._id;
			const userData = await getUserProfile(userId);
			const profileData = await removeKeys(
				userData._doc,
				"__v",
				"password",
				" userToken",
				"createdAt",
				"updatedAt"
			);
			return res.status(200).json({ message: "Successfully fetched profile", profileData });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error" });
		}
	},

	updateProfile: async (req, res) => {
		try {
			const userId = req.user.id;
			const userData = await updateProfile(userId, req.body);
			const profileData = await removeKeys(userData._doc, "__v", "password", " userToken");
			return res.status(200).json({ message: "User Updated SuccessFully", profileData });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error" });
		}
	},
	updateProfilePic: async (req, res) => {
		try {
			const userId = req.user.id;
			console.log("userId:::", userId);
			if (typeof req.file === "undefined") {
				return res.status(404).json({ message: "Profile pic not found " });
			}
			const img = res.sendFile(path.join(__dirname, `./public/images/${req.file.filename}`));
			console.log("img:::", img);
			// const profilePic = "http://localhost:5000" + "/public/images/" + req.file.filename;
			const userData = await updateProfilePic(userId, img);
			const profileData = await removeKeys(userData._doc, "__v", "password", " userToken");
			return res.status(200).json({ message: "User Updated SuccessFully", profileData });
		} catch (err) {
			console.log(err);
			return res.status(500).json({ message: "Server Error", err });
		}
	},

	changePassword: async (req, res) => {
		try {
			const userId = req.user.id;
			const { oldPassword, newPassword, confirmPassword } = req.body;
			if (newPassword == confirmPassword) {
				const userData = await getUserProfile(userId);
				if (!userData) {
					return res.status(404).json({ message: "User Not found" });
				} else {
					let compare = await comparePassword(userData.password, oldPassword);
					if (compare == true) {
						var hashedPassword = await bcrypt.hash(newPassword, 10);
						const data = await changePassword(userId, hashedPassword);
						return res.status(200).json({ message: "Password successfully Changed " });
					} else {
						return res.status(404).json({ message: "Invalid Old password" });
					}
				}
			} else {
				return res.status(400).json({
					message: "newPassword and confirmPassword doesnot match.",
				});
			}
		} catch (error) {
			return res.status(500).json({ message: "Server  error " });
		}
	},

	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
			if (!email) {
				return res.status(421).json({ message: "Please add email to proceed futher!!" });
			}
			const userData = await findUserByEmail(email);
			if (!userData) {
				return res.status(404).json({ message: "No User found, Please register !!" });
			}
			const secret = process.env.SECRET_KEY + userData.password;
			const payload = {
				email: userData.email,
				_id: userData._id,
			};
			const token = jwt.sign(payload, secret, { expiresIn: "10m" });
			const link = `${req.protocol}://${req.hostname}:${process.env.PORT}/api/user/reset-password/${payload._id}/${token}`;
			const data = await sendMailHtml(
				email,
				"rehanpanjwar@gmail.com",
				"passwod-reset",
				`<h2>Please click on given link to reset-password</h2> <p>${link}</p>`
			);
			return res
				.status(200)
				.json({ message: "reset-password Successfully sent to given Email", link });
		} catch (error) {
			console.log("error", error);
			return res.status(500).json({ message: "Server error" });
		}
	},

	resetPassword: async (req, res) => {
		try {
			const { userId, token } = req.params;
			const { newPassword, confirmPassword } = req.body;
			if (!newPassword || !confirmPassword) {
				return res.status(421).json({ message: "Please add all the feilds" });
			} else {
				if (newPassword == confirmPassword) {
					var hashedPassword = await bcrypt.hash(newPassword, 10);
					const userData = await resetPassword(userId, token, hashedPassword);
					return res.status(200).json({ message: "Password Reset Successfully!! please Login" });
				} else {
					return res
						.status(400)
						.json({ message: "newPassword And ConfirmPassword Doesn't Match!!" });
				}
			}
		} catch (err) {
			res.status(500).json({ message: "Server Error" });
		}
	},

	logout: async (req, res) => {
		try {
			const userId = req.user._id;
			const logoutData = await logout(userId);
			return res.status(200).json({ message: "successFully Logout" });
		} catch (error) {
			console.log(err);
		}
	},
};