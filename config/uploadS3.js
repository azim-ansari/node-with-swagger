import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

const bucketName = process.env.AWS_BUCKET_NAME;

aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_BUCKET_REGION,
});
const s3 = new aws.S3();

const uploadSetting = multerS3({
	s3,
	bucket: bucketName,
	acl: "public-read",
	ContentEncoding: "base64",
	contentType: (req, file, cb) => {
		cb(null, file.mimetype);
	},
	metadata: (req, file, cb) => {
		cb(null, { classification: "image", ...req.body });
	},
	key: (req, file, cb) => {
		const filename = file.originalname;
		const fileExtension = filename.split(".")[1];
		cb(null, `${Date.now()}.${fileExtension}`);
	},
});

const uploadS3 = multer({
	storage: uploadSetting,
}).single("postCoverPic");

export default uploadS3;
