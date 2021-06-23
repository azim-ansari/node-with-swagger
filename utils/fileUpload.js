import multer from "multer";

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/gif"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
// image path
// limit: 5mb
// filter : png, jpeg,jpg
var upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

export default upload;
