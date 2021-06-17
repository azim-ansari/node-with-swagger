import userJoi from "../validation/userValidation";
import {
  signup,
  findUserByEmail,
  updateUserByEmail,
  signout,
  getUser,
  passwordChange,
} from "../services/userServices";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { removeKeys } from "../utils/removeKeys";
import { comparePassword } from "../utils/compare";

module.exports = {
  register: async (req, res) => {
    try {
      const value = await userJoi.validateAsync(req.body);
      const user = await findUserByEmail(req.body.email);
      if (user) {
        return res.status(421).json({ message: "User Registered already!!" });
      }
      const userInfo = await signup(value);
      const newUser = await removeKeys(
        userInfo._doc,
        "password",
        "updatedAt",
        "__v"
      );
      res
        .status(201)
        .json({ message: "Registered successfuly", user: newUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  login: async (req, res) => {
    try {
      const user = await findUserByEmail(req.body.email);
      if (!user) {
        return res.status(404).json({ message: "User Not Registered" });
      } else {
        const match = await comparePassword(user.password, req.body.password);
        if (match == false) {
          return res
            .status(421)
            .json({ message: "Invalid Credential, Try again!!" });
        } else {
          const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
          const userData = await updateUserByEmail(req.body.email, {
            userToken: token,
            tokenExpiresIn: Date.now() + 60 * 60 * 1000,
          });
          const LoginData = removeKeys(
            userData._doc,
            "password",
            "tokenExpiresIn",
            "__v"
          );
          return res
            .status(200)
            .json({ message: "LoggedIn successfully", LoginData });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  profile: async (req, res) => {
    try {
      const userId = req.user._id;
      const userData = await getUser(userId);
      const profileData = await removeKeys(
        userData._doc,
        "__v",
        "password",
        " userToken",
        "createdAt",
        "updatedAt"
      );
      return res
        .status(200)
        .json({ message: "Successfully fetched profile", profileData });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  changePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword, confirmPassword } = req.body;
      if (newPassword == confirmPassword) {
        const userData = await getUser(userId);
        if (!userData) {
          return res.status(404).json({ message: "User Not found" });
        } else {
          let compare = await comparePassword(
            userData.password,
            oldPassword
          );
          if (compare == true) {
            var hashedPassword = await bcrypt.hash(newPassword, 10);
            const data = await passwordChange(userId,hashedPassword);
            return res.status(200).json({message: "Password successfully Changed "});
          } else {
            return res.status(404).json({ message: "Invalid Old password" });
          }
        }
      } else {
        return res.status(400).json({
          message: "newPassword and confirmPassword doesnot match.",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Server  error " });
    }
  },
  forgotPassword: async(req, res) => {
    try {
      const {email} = req.body
      const userData = await findUserByEmail(email);
      console.log("userData:::", userData)
    } catch (error) {
      return res.status(500).json({ message: "Server error"});
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.user._id;
      const logoutData = await signout(userId);
      return res.status(200).json({ message: "successFully Logout" });
    } catch (error) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
};
