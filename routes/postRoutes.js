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
	uploadFileOnS3,
	likePost,
} from "../controller/postController";
// import upload from "../utils/fileUpload";
import uploadS3 from "../config/uploadS3";

var router = express.Router();

/* GET users listing */
router.post(
	"/add-post",
	verifyToken,
	(req, res, next) => {
		uploadS3(req, res, error => {
			if (error) {
				console.log(`error from aws ->  ${error}`);
			} else {
				next();
			}
		});
	},
	addPost
);
router.post(
	"/upload-image",
	(req, res, next) => {
		uploadS3(req, res, error => {
			if (error) {
				console.log(`error from aws ->  ${error}`);
			} else {
				next();
			}
		});
	},
	uploadFileOnS3
);

router.get("/all-post", verifyToken, postList);
router.get("/single-post/:id", verifyToken, singlePostDetail);
router.get("/single-post/:id", verifyToken, singlePostDetail);
router.put("/like-post/:id", verifyToken, likePost);
router.delete("/delete-post/:id", verifyToken, deletePost);
router.post("/add-comment/:id", verifyToken, addComment);
router.put("/update-comment/:id", verifyToken, updateComment);

export default router;
