import mongoose from "mongoose";
import bcrypt from "bcryptjs";
mongoose.set("debug", true);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    dob: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "https://i.ibb.co/NyYpfGD/dp.jpg",
    },
    userToken: {
      type: String,
    },
    tokenExpiresIn: {
      type: String,
    },
    resetLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(cb) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    cb();
  } catch (error) {
    cb(error);
  }
});

userSchema.methods.correctPassword = async function (password, encryptedPass) {
  return await bcrypt.compare(password, encryptedPass);
};

export default mongoose.model("User", userSchema);
