import mongoose from "mongoose";
import userModel from "../model/userModel";

export const signup = async data => {
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

export const profileUpdate = async (userId, data) => {
	return await userModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, data, {
		new: true,
	});
};

export const getUser = async userId => {
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

export const passwordReset = async (userId, token, password) => {
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { userToken: token, password: password } },
		{ new: true }
	);
};

export const passwordChange = async (userId, hashedPassword) => {
	return await userModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(userId) },
		{ $set: { password: hashedPassword } },
		{ new: true }
	);
};
