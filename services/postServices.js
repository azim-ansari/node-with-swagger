import mongoose from "mongoose";
import postModel from "../model/postModel";

export const postAdd = async (title, description, createdBy) => {
  return await postModel.create({
    title: title,
    description: description,
    createdBy: createdBy,
  });
};

export const allPost = async () => {
  return await postModel.find();
};

export const postSingleData = async postId => {
  return await postModel.find(
    { _id: mongoose.Types.ObjectId(postId) },
    { description: 1, title: 1, createdBy: 1, createdAt: 1, updatedAt: 1 }
  );
};

export const updatedPost = async (postId, userId, postData) => {
  return await postModel.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(postId),
      createdBy: mongoose.Types.ObjectId(userId),
    },
    postData,
    { new: true, upsert: false }
  );
};

export const postDelete = async (postId, userId) => {
  return await postModel.deleteOne({
    _id: mongoose.Types.ObjectId(postId),
    createdBy: mongoose.Types.ObjectId(userId),
  });
};
