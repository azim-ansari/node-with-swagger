import express from "express";
import postController from "../controller/postController";
import middleware from "../middleware/isAuth";
var router = express.Router();
/* GET users listing */
router.get("/all-post", middleware.verifyToken, postController.postList);
router.get(
  "/single-post/:id",
  middleware.verifyToken,
  postController.postDetails
);
router.post("/add-post", middleware.verifyToken, postController.addPost);
router.put(
  "/update-post/:id",
  middleware.verifyToken,
  postController.postUpdate
);
router.delete(
  "/delete-post/:id",
  middleware.verifyToken,
  postController.deletePost
);

module.exports = router;
