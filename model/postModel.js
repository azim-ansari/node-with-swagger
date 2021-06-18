import mongoose from "mongoose";
mongoose.set("debug", true);

const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
