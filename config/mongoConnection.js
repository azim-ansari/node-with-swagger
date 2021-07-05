import mongoose from "mongoose";

require("dotenv").config();

//connecting database

const mongoInit = async () => {
	try {
		await mongoose.connect(process.env.DATABASE, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log("Connected to Database yeah !! ✌️");
	} catch (e) {
		console.log(error.message);
	}
};

export default mongoInit;
