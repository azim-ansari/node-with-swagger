import mongoose from "mongoose";
mongoose.set("debug", true);

const commentSchema = new mongoose.Schema({
	description: {
		type: String,
	},
	commentedBy: {
		type: String,
	},
});

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
		postCoverPic: [
			{
				type: String,
				default: "",
			},
		],
		comments: [commentSchema],
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Post", postSchema);
