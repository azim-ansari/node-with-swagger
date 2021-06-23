import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoInit from "./dbConnection/mongoConnection";
import swaggerUI from "swagger-ui-express";
import swaggerJson from "./docs/swagger.json";
import indexRouter from "./routes/index";

mongoInit();
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: "CRUD",
			version: "1.0.0",
		},
	},
	apis: ["app.js"],
};
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.use("/api", indexRouter);

app.use("/public/images", express.static(path.join(__dirname, "public/images")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(res.status(404).json({ message: "Not found" }));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
