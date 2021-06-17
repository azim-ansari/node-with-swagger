import mongoose from "mongoose";
import postModel from "../model/postModel";

exports.postAdd = async (title, description, createdBy) => {
  return await postModel.create({
    title: title,
    description: description,
    createdBy: createdBy,
  });
};
exports.allPost = async () => {
  return await postModel.find();
};
exports.postSingleData = async postId => {
  return await postModel.find(
    { _id: mongoose.Types.ObjectId(postId) },
    { description: 1, title: 1, createdBy: 1, createdAt: 1, updatedAt: 1 }
  );
};
exports.updatedPost = async (postId, userId, postData) => {
  return await postModel.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(postId),
      createdBy: mongoose.Types.ObjectId(userId),
    },
    postData,
    { new: true, upsert: false }
  );
};
exports.postDelete = async (postId, userId) => {
  return await postModel.deleteOne({
    _id: mongoose.Types.ObjectId(postId),
    createdBy: mongoose.Types.ObjectId(userId),
  });
};
