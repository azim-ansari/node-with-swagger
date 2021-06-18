import express from "express";
import postRouter from "./postRoutes";
import userRouter from "./userRoutes";
var router = express.Router();
/* GET home page. */
router.use("/post", postRouter);
router.use("/user", userRouter);

export default router;
