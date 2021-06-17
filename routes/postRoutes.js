import express from "express";
import {
  postList,
  postDetails,
  addPost,
  postUpdate,
  deletePost,
} from "../controller/postController";
import { verifyToken } from "../middleware/isAuth";
var router = express.Router();
/* GET users listing */
router.get("/all-post", verifyToken, postList);
router.get("/single-post/:id", verifyToken, postDetails);
router.post("/add-post", verifyToken, addPost);
router.put("/update-post/:id", verifyToken, postUpdate);
router.delete("/delete-post/:id", verifyToken, deletePost);

module.exports = router;
