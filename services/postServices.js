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

export const singlePostDetail = async postId => {
	return await postModel.find(
		{ _id: mongoose.Types.ObjectId(postId) },
		{ description: 1, title: 1, createdBy: 1, createdAt: 1, updatedAt: 1 }
	);
};

export const updatePost = async (postId, userId, postData) => {
	return await postModel.findOneAndUpdate(
		{
			_id: mongoose.Types.ObjectId(postId),
			createdBy: mongoose.Types.ObjectId(userId),
		},
		postData,
		{ new: true, upsert: false }
	);
};

export const deletePost = async (postId, userId) => {
	return await postModel.deleteOne({
		_id: mongoose.Types.ObjectId(postId),
		createdBy: mongoose.Types.ObjectId(userId),
	});
};

export const addComment = async (postId, userId, data) => {
	const commentData = await postModel.findOneAndUpdate(
		{ _id: mongoose.Types.ObjectId(postId) },
		{
			$push: {
				comments: {
					commentedBy: userId,
					description: data,
				},
			},
		},
		{ new: true, upsert: true }
	);
	return commentData;
};

export const updateComment = async (commentId, userId, data) => {
	console.log("data:::", data);
	return await postModel.findOneAndUpdate(
		{
			"comments._id": mongoose.Types.ObjectId(commentId),
			"comments.commentedBy": userId,
		},
		{
			$set: {
				comments: {
					description: data,
				},
			},
		},
		{
			new: true,
		}
	);
};
