import {
	postAdd,
	allPost,
	singlePostDetail,
	updatePost,
	deletePost,
	addComment,
	updateComment,
} from "../services/postServices";

module.exports = {
	addPost: async (req, res) => {
		try {
			const userId = req.user._id;
			const { title, description } = req.body;
			if (!title || !description) {
				return res.status(421).json({ message: "Please Enter title and description" });
			}
			const data = await postAdd(title, description, userId);
			res.status(201).json({ message: "Created Post", data });
		} catch (err) {
			console.log("Err:::", err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
	postList: async (req, res) => {
		try {
			const data = await allPost({});
			res.status(200).json({ message: "All post List", data });
		} catch (err) {
			res.status(500).json({ message: "Server Error", err });
		}
	},
	singlePostDetail: async (req, res) => {
		try {
			const postId = req.params.id;
			if (postId == "undefined") {
				return res.status(404).json({ message: "Please Enter the Id of post" });
			}
			console.log(postId);
			const data = await singlePostDetail(postId);
			res.status(200).json({ message: "single post here", data });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
	updatePost: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user._id;
			const data = await updatePost(postId, userId, req.body);
			if (data == null) {
				return res.status(404).json({ message: "Post not created yet, please Add post" });
			}
			return res.status(200).json({ message: "single post updated", data });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
	deletePost: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user._id;
			if (postId == "undefined") {
				return res.status(404).json({ message: "post data not found" });
			}
			const data = await deletePost(postId, userId);
			console.log("data::", data);
			if (data.deletedCount == 0) {
				return res.status(404).json({ message: "No post available to delete" });
			}
			return res.status(200).json({ message: "single post deleted" });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
	addComment: async (req, res) => {
		try {
			const postId = req.params.id;
			const userId = req.user.id;
			const { description } = req.body;
			const commentData = await addComment(postId, userId, description);
			return res.status(200).json({ message: "comments Added successfully", commentData });
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
	updateComment: async (req, res) => {
		try {
			const commentId = req.params.id;
			const userId = req.user.id;
			const { description } = req.body;
			if (commentId == "undefined") {
				return res.status(404).json({ message: "please Enter a valid commentId" });
			} else {
				const commentData = await updateComment(commentId, userId, description);
				console.log("commentData:::", commentData);
				return res.status(200).json({ message: "updated  comment  successfully", commentData });
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: "Server Error", err });
		}
	},
};
