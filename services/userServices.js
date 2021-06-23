import mongoose from "mongoose";
import userModel from "../model/userModel";

export const register = async data => {
	return await userModel.create(data);
};

export const findUserByEmail = async data => {
	return await userModel.findOne({ email: data });
};

export const updateUserByEmail = async (email, data) => {
	return await userModel.findOneAndUpdate({ email: email }, data, {
		new: true,
	});
};

export const updateProfile = async (userId, data) => {
	return await userModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, data, {
		new: true,
	});
};
export const updateProfilePic = async (userId, data) => {
	console.log("data:::", data);
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { profilePic: data } },
		{
			new: true,
		}
	);
};

export const getUserProfile = async userId => {
	return await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) });
};

export const logout = async userId => {
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { userToken: "" } },
		{ new: true }
	);
};

export const findUserByToken = async token => {
	return await userModel.findOne({ userToken: token });
};

export const resetPassword = async (userId, token, password) => {
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { userToken: token, password: password } },
		{ new: true }
	);
};

export const changePassword = async (userId, hashedPassword) => {
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { password: hashedPassword } },
		{ new: true }
	);
};
