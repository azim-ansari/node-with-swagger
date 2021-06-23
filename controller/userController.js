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
	updateCoverPic,
} from "../services/userServices";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { removeKeys } from "../utils/removeKeys";
import { comparePassword } from "../utils/compare";
import { sendMailHtml } from "../utils/sendEmail";
import { handleResponse, handleError } from "../config/requestHandler";

module.exports = {
	register: async (req, res) => {
		try {
			const value = await userJoi.validateAsync(req.body);
			const user = await findUserByEmail(req.body.email);
			if (user) {
				return handleResponse({ res, msg: "User Registered already!!" });
			} else {
				const userInfo = await register(value);
				const newUser = await removeKeys(userInfo._doc, "password", "updatedAt", "__v");
				return handleResponse({ res, msg: "Registered successfuly", data: newUser });
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	login: async (req, res) => {
		try {
			const user = await findUserByEmail(req.body.email);
			if (!user) {
				return handleResponse({ res, msg: "User Not Registered" });
			} else {
				const match = await comparePassword(user.password, req.body.password);
				if (match == false) {
					return handleResponse({ res, msg: "Invalid Credential, Try again!!" });
				} else {
					const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
					const userData = await updateUserByEmail(req.body.email, {
						userToken: token,
						tokenExpiresIn: Date.now() + 60 * 30 * 1000,
					});
					const LoginData = removeKeys(userData._doc, "password", "tokenExpiresIn", "__v");
					return handleResponse({ res, msg: "LoggedIn successfully", data: LoginData });
				}
			}
		} catch (error) {
			return handleError({ res, error, data: error });
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
			return handleResponse({ res, msg: "Successfully fetched profile", data: profileData });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	updateProfile: async (req, res) => {
		try {
			const userId = req.user.id;
			const userData = await updateProfile(userId, req.body);
			const profileData = await removeKeys(userData._doc, "__v", "password", " userToken");
			return handleResponse({ res, msg: "User Updated SuccessFully", data: profileData });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	updateProfilePic: async (req, res) => {
		try {
			const userId = req.user.id;
			if (typeof req.file === "undefined") {
				return handleResponse({ res, msg: "Profile pic not found " });
			}
			const profilePic = "http://localhost:5000" + "/public/images/" + req.file.filename;
			const userData = await updateProfilePic(userId, profilePic);
			const profileData = await removeKeys(userData._doc, "__v", "password", " userToken");
			return handleResponse({ res, msg: "User profile Updated SuccessFully", data: profileData });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	updateCoverPic: async (req, res) => {
		try {
			const userId = req.user.id;
			if (typeof req.files === "undefined") {
				return handleResponse({ res, msg: "Profile pic not found " });
			}
			const coverPicData = req.files.map(item => {
				return "http://localhost:5000" + "/public/images/" + item.filename;
			});
			const userData = await updateCoverPic(userId, coverPicData);
			const profileData = await removeKeys(userData._doc, "__v", "password", " userToken");
			return handleResponse({ res, msg: "User cover pic Updated SuccessFully", data: profileData });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	changePassword: async (req, res) => {
		try {
			const userId = req.user.id;
			const { oldPassword, newPassword, confirmPassword } = req.body;
			if (newPassword == confirmPassword) {
				const userData = await getUserProfile(userId);
				if (!userData) {
					return handleResponse({ res, msg: "User Not found" });
				} else {
					let compare = await comparePassword(userData.password, oldPassword);
					if (compare == true) {
						var hashedPassword = await bcrypt.hash(newPassword, 10);
						const data = await changePassword(userId, hashedPassword);
						return handleResponse({ res, msg: "Password successfully Changed " });
					} else {
						return handleResponse({ res, msg: "Invalid Old password" });
					}
				}
			} else {
				return handleResponse({ res, msg: "newPassword and confirmPassword doesnot match." });
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
			if (!email) {
				return handleResponse({ res, msg: "Please add email to proceed futher!!" });
			}
			const userData = await findUserByEmail(email);
			if (!userData) {
				return handleResponse({ res, msg: "No User found, Please register !!" });
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
			return handleResponse({
				res,
				msg: "link Successfully sent to given Email",
				data: link,
			});
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	resetPassword: async (req, res) => {
		try {
			const { userId, token } = req.params;
			const { newPassword, confirmPassword } = req.body;
			if (!newPassword || !confirmPassword) {
				return handleResponse({ res, msg: "Please add all the feilds" });
			} else {
				if (newPassword == confirmPassword) {
					var hashedPassword = await bcrypt.hash(newPassword, 10);
					const userData = await resetPassword(userId, token, hashedPassword);
					return handleResponse({ res, msg: "Password Reset Successfully!! please Login" });
				} else {
					return handleResponse({ res, msg: "newPassword And ConfirmPassword Doesn't Match!!" });
				}
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},

	logout: async (req, res) => {
		try {
			const userId = req.user._id;
			const logoutData = await logout(userId);
			return handleResponse({ res, msg: "successFully Logout" });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},
};
