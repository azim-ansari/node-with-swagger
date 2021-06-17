import jwt from "jsonwebtoken";
import { getUser, findUserByToken } from "../services/userServices";

module.exports = {
  isAuth: async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login first", error: [], data: {} });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // correct key
      if (typeof decoded !== "undefined") {
        const loggedInUserId = decoded._id;
        req.loggedInUserInfo = await getUser(loggedInUserId);
        req.loggedInUserId = loggedInUserId;
        next();
      } else {
        res.status(401).json({ message: "User is unauthorized." });
      }
    } catch (err) {
      console.log(err, "error");
      res.status(403).json({ message: "Invalid token", error: [], data: {} });
    }
  },
  verifyToken: async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login first", error: [], data: {} });
    }
    try {
      const user = await findUserByToken(token);
      if (!user) {
        return res.status(404).json({ message: "User Not LoggedIn" });
      }
      if (user.tokenExpire < Date.now()) {
        return res.status(404).json({ message: "User Token expired " });
      }
      req.user = user;
      next();
    } catch (err) {
      console.log(err, "error");
      res.status(403).json({ message: "Invalid token", error: [], data: {} });
    }
  },
  // isAdmin: async (req, res, next) => {
  //   try {
  //     if (req.user.role == "admin") {
  //       next();
  //     } else {
  //       res.status(500).json({ message: "This route is only for Admin" });
  //     }
  //   } catch (e) {
  //     console.log(err, "error");
  //     res
  //       .status(403)
  //       .json({ message: "Invalid Admin token", error: [], data: {} });
  //   }
  // },
  user: async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login first", error: [], data: {} });
    }

    try {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
      next();
    } catch (error) {
      console.log("error:::", error);
      return res.status(401).json({ message: "User is unauthorized." });
    }
  },
};
