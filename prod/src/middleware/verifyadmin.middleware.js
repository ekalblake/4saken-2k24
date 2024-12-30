import pool from "../database.js";
import errors, { sendResponse } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import { verifyAdmin } from "../models/adminModel.js";
import Logger from "../utils/logger.js";

export const isAdmin = async (req, res, next) => {
	try {
		const { userid } = req.session;

		const response = await verifyAdmin(userid);

		if (response.Rol == 2) return next();

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, ADMIN_MESSAGES.ADMIN_VERIFY_NOT_ADMIN);
	} catch (err) {
		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, ADMIN_MESSAGES.ADMIN_VERIFY_GENERAL_ERROR);
	}
};
