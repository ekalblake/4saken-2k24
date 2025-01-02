let allowedFiles = {
	image: { max_size: 10000000, mime_types: ["image/jpeg", "image/png"] },
	document: {
		max_size: 10000000,
		mime_types: [
			// Ms
			"application/msword",
			"application/vnd.ms-excel",
			"application/vnd.ms-powerpoint",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation",
			// PDF
			"application/pdf",
			//Comprimidos
			"application/x-rar-compressed",
			"application/x-tar",
			"application/zip",
			"application/gzip",
			"application/x-7z-compressed",
			"application/x-compressed-tar",
			// Open document
			"application/vnd.oasis.opendocument.presentation",
			"application/vnd.oasis.opendocument.spreadsheet",
			"application/vnd.oasis.opendocument.text",
		],
	},
	audio: {
		max_size: 10000000,
		mime_types: ["audio/aac", "audio/mp4", "audio/amr", "audio/mpeg", "audio/ogg"],
	},
	video: { max_size: 10000000, mime_types: ["video/mp4", "video/3gpp"] },
	text: { max_size: 10000000, mime_types: ["text/csv", "text/plain"] },
};

export const validFileChoosed = (currentFile: File | null) => {
	console.log(currentFile);
	let returnObj = {
		message: "",
		success: true,
	};

	if (!currentFile) {
		returnObj = {
			message: "Por favor adjunta un archivo",
			success: false,
		};
		return returnObj;
	}

	if (currentFile?.type.includes("image")) {
		let allowedImage = allowedFiles.image;

		if (currentFile.size > allowedImage.max_size) {
			returnObj = {
				message: `Peso máximo de la imagen: ${allowedImage.max_size / 1000000}MB.`,
				success: false,
			};
			return returnObj;
		}

		if (!allowedImage.mime_types.includes(currentFile.type)) {
			returnObj = {
				message: `Tipo de imagen no permitida.`,
				success: false,
			};
			return returnObj;
		}

		return returnObj;
	}

	// Validación para documentos
	/* if (currentFile.type.includes("application")) {
		let allowedDoc = allowedFiles.document;

		if (currentFile.size > allowedDoc.max_size) {
			returnObj = {
				message: `Peso máximo del documento: ${allowedDoc.max_size / 1000000}MB.`,
				success: false,
			};
			return returnObj;
		}

		if (!allowedDoc.mime_types.includes(currentFile.type)) {
			returnObj = {
				message: `Tipo de documento no permitido.`,
				success: false,
			};
			return returnObj;
		}

		return returnObj;
	} */

	// Validación para audios
	/* if (currentFile.type.includes("audio")) {
		let allowedAudio = allowedFiles.audio;

		if (currentFile.size > allowedAudio.max_size) {
			returnObj = {
				message: `Peso máximo del audio: ${allowedAudio.max_size / 1000000}MB.`,
				success: false,
			};
			return returnObj;
		}

		if (!allowedAudio.mime_types.includes(currentFile.type)) {
			returnObj = {
				message: `Tipo de audio no permitido.`,
				success: false,
			};
			return returnObj;
		}

		return returnObj;
	} */

	/* if (currentFile.type.includes("video")) {
		let allowedVideo = allowedFiles.video;

		if (currentFile.size > allowedVideo.max_size) {
			returnObj = {
				message: `Peso máximo del video: ${allowedVideo.max_size / 1000000}MB.`,
				success: false,
			};
			return returnObj;
		}

		if (!allowedVideo.mime_types.includes(currentFile.type)) {
			returnObj = {
				message: `Tipo de video no permitido.`,
				success: false,
			};
			return returnObj;
		}

		return returnObj;
	} */

	/* if (currentFile.type.includes("text")) {
		let allowedText = allowedFiles.text;

		if (currentFile.size > allowedText.max_size) {
			returnObj = {
				message: `Peso máximo del archivo: ${allowedText.max_size / 1000000}MB.`,
				success: false,
			};
			return returnObj;
		}

		if (!allowedText.mime_types.includes(currentFile.type)) {
			returnObj = {
				message: `Tipo de archivo ${currentFile.type} no permitido.`,
				success: false,
			};
			return returnObj;
		}

		return returnObj;
	} */

	returnObj = {
		message: `El archivo ${currentFile.name} no es admitido!`,
		success: false,
	};
	return returnObj;
};
