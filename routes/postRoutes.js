import express from "express";
import { verifyToken } from "../middleware/isAuth";
import {
	postList,
	singlePostDetail,
	addPost,
	updatePost,
	deletePost,
} from "../controller/postController";

var router = express.Router();

/* GET users listing */
router.post("/add-post", verifyToken, addPost);
router.get("/all-post", verifyToken, postList);
router.get("/single-post/:id", verifyToken, singlePostDetail);
router.put("/update-post/:id", verifyToken, updatePost);
router.delete("/delete-post/:id", verifyToken, deletePost);

export default router;
