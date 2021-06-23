import express from "express";
import { verifyToken } from "../middleware/isAuth";
import {
	postList,
	singlePostDetail,
	addPost,
	updatePost,
	deletePost,
	addComment,
	updateComment,
} from "../controller/postController";
import upload from "../utils/fileUpload";

var router = express.Router();

/* GET users listing */
router.post("/add-post", verifyToken, upload.single("postCoverPic"), addPost);
router.get("/all-post", verifyToken, postList);
router.get("/single-post/:id", verifyToken, singlePostDetail);
router.put("/update-post/:id", verifyToken, updatePost);
router.delete("/delete-post/:id", verifyToken, deletePost);
router.post("/add-comment/:id", verifyToken, addComment);
router.put("/update-comment/:id", verifyToken, updateComment);

export default router;
