import mongoose from "mongoose";
import userModel from "../model/userModel";

exports.signup = async data => {
  return await userModel.create(data);
};

exports.findUserByEmail = async data => {
  return await userModel.findOne({ email: data });
};

exports.updateUserByEmail = async (email, data) => {
  return await userModel.findOneAndUpdate({ email: email }, data, {
    new: true,
  });
};

exports.getUser = async userId => {
  return await userModel.findOne({ _id: mongoose.Types.ObjectId(userId) });
};

exports.signout = async userId => {
  return await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    { $set: { userToken: "" } },
    { new: true }
  );
};

exports.findUserByToken = async token => {
  return await userModel.findOne({ userToken: token });
};

exports.passwordChange = async (userId, hashedPassword) => {
  return await userModel.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userId) },
    {$set:{password:hashedPassword}},
    { new: true }
  );
};
