import {
	postAdd,
	allPost,
	singlePostDetail,
	updatePost,
	deletePost,
	addComment,
	updateComment,
	likePost,
	sheet,
} from "../services/postServices";
import postJson from "../posts.json";
import json2xls from "json2xls";
import { handleResponse, handleError } from "../config/requestHandler";
import fs from "fs";

module.exports = {
	addPost: async (req, res) => {
		try {
			const userId = req.user.id;
			const { title, description } = req.body;
			if (!title || !description) {
				return handleResponse({ res, msg: "Please Enter title and description" });
			}
			if (typeof req.file == undefined) {
				return handleResponse({ res, msg: "Profile pic not found" });
			}
			// const postCoverPic = req.file.map(item => {
			// 	return item.location;
			// });
			const data = await postAdd(title, description, userId, req.file.location);
			return handleResponse({ res, msg: "Created Post", data: data });
		} catch (error) {
			console.log(error);
			return handleError({ res, error, data: error });
		}
	},
	uploadFileOnS3: async (req, res) => {
		try {
			if (!req.file) {
				return handleResponse({ res, msg: "No file were uploaded." });
			} else {
				const ress = { data: req.file.length, file: req.file.location };
				return handleResponse({ res, msg: "Successfully uploaded ", data: ress });
			}
		} catch (error) {
			console.log("error:::", error);
			return handleError({ res, error, data: error });
		}
	},
	postList: async (req, res) => {
		try {
			const page = parseInt(req.query.page, 10) || 0;
			const limit = parseInt(req.query.limit, 10) || 100;
			const title = req.query.title;
			const data = await allPost(page, limit, title);
			const count = data.length;
			const result = { "number of posts": count, data: data };
			return handleResponse({ res, msg: "All post List", data: result });
		} catch (error) {
			console.log("error:::", error);
			return handleError({ res, error, data: error });
		}
	},
	singlePostDetail: async (req, res) => {
		try {
			const postId = req.params.id;
			if (postId == "undefined") {
				return handleResponse({ res, msg: "Please Enter the Id of post" });
			} else {
				const data = await singlePostDetail(postId);
				return handleResponse({ res, msg: "single post here", data: data });
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},
	updatePost: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user._id;
			const data = await updatePost(postId, userId, req.body);
			if (data == null) {
				return handleResponse({ res, msg: "Post not created yet, please Add post" });
			} else {
				return handleResponse({ res, msg: "single post here", data: data });
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},
	deletePost: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user._id;
			if (postId == "undefined") {
				return handleResponse({ res, msg: "post data not found" });
			}
			const data = await deletePost(postId, userId);
			if (data.deletedCount == 0) {
				return handleResponse({ res, msg: "No post available to delete" });
			} else {
				return handleResponse({ res, msg: "single post deleted" });
			}
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},
	addComment: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user.id;
			const { description } = req.body;
			const commentData = await addComment(postId, userId, description);
			return handleResponse({ res, msg: "comments Added successfully", data: commentData });
		} catch (error) {
			return handleError({ res, error, data: error });
		}
	},
	updateComment: async (req, res) => {
		try {
			const commentId = req.params.id;
			const userId = req.user.id;
			const { description } = req.body;
			if (commentId == "undefined") {
				return handleResponse({ res, msg: "please Enter a valid commentId" });
			} else {
				const commentData = await updateComment(commentId, userId, description);
				return handleResponse({ res, msg: "updated  comment  successfully", data: commentData });
			}
		} catch (error) {
			console.log("error::", error);
			return handleError({ res, error, data: error });
		}
	},
	likePost: async (req, res) => {
		try {
			const postId = req.params.Id;
			const userId = req.user.id;

			const likedPost = await likePost(postId, userId);
			console.log("likedPost::::", likedPost);
			return handleResponse({ res, msg: "post Liked successfully", data: likedPost });
		} catch (error) {
			console.log("error::", error);
			return handleError({ res, error, data: error });
		}
	},
	sheet: async (req, res) => {
		try {
			const sheetData = await allPost();
			const data = JSON.stringify(sheetData);
			fs.writeFile("posts.json", data, (err, result) => {
				if (err) {
					return handleError({ res, error, data: error });
				} else {
					handleResponse({ res, msg: "file created successfully" });
				}
			});
		} catch (error) {
			console.log("error::", error);
			return handleError({ res, error, data: error });
		}
	},
	sheetInExcel: async (req, res) => {
		try {
			var xls = json2xls(postJson, {
				fields: ["description"],
			});
			fs.writeFileSync("posts.xlsx", xls, (err, result) => {
				if (err) {
					return handleError({ res, error, data: error });
				} else {
					handleResponse({ res, msg: "file created successfully" });
				}
			});
		} catch (error) {
			console.log("error::", error);
			return handleError({ res, error, data: error });
		}
	},
};
