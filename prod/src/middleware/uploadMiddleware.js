import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "media/uploads/";
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const currentTimestamp = Date.now();
		const fileName = file.fieldname;
		const steamId = req.session.steamid;
		const fileExtension = path.extname(file.originalname);
		const fullNameFile = `${fileName}_${steamId}_${currentTimestamp}${fileExtension}`;

		cb(null, fullNameFile);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpg|jpeg|png|gif|pdf|mp3|mp4|ogg/;
	const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = allowedTypes.test(file.mimetype);

	if (mimetype && extname) {
		cb(null, true);
	} else {
		cb(new Error("Tipo de archivo no permitido"), false);
	}
};

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
