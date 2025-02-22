import { CLIENT_URL } from "../config.js";

export let isAuthorized = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(404).json({
		success: false,
		message: "Logeate o reinicia la página, por favor.",
	});
};

export let isNotAuthorized = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.redirect(CLIENT_URL);
	} else {
		next();
	}
};
