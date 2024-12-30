import pool from "../database.js";
import errors, { sendResponse } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import Gamedig from "gamedig";
import Logger from "../utils/logger.js";
import { addServer, deleteServerAdmin, getServerList } from "../models/adminModel.js";
import { ADMIN_MESSAGES } from "../utils/constants.js";

export const getServerListAdmin = async (req, res) => {
	Logger.request(req);

	try {
		const response = await getServerList();

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, ADMIN_MESSAGES.ADMIN_SERVER_LIST_SUCCESSFUL);
	} catch (err) {
		Logger.error(ADMIN_MESSAGES.ADMIN_SERVER_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, ADMIN_MESSAGES.ADMIN_SERVER_GENERAL_ERROR);
	}
};

export const newServer = async (req, res) => {
	Logger.request(req);
	try {
		const { ip, extra, port } = req.body;

		if (!ip || !extra || !port) {
			Logger.response(req, res);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, ADMIN_MESSAGES.ADMIN_SERVER_ADD_ERROR_PARAMS);
		}

		const response = await addServer(ip, extra, port);

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, ADMIN_MESSAGES.ADMIN_SERVER_ADD_SUCCESSFUL);
	} catch (err) {
		Logger.error(ADMIN_MESSAGES.ADMIN_SERVER_ADD_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, ADMIN_MESSAGES.ADMIN_SERVER_ADD_GENERAL_ERROR);
	}
};

export const deleteServer = async (req, res) => {
	try {
		const { serverid } = req.params;

		if (!serverid) {
			Logger.response(req, res);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, ADMIN_MESSAGES.ADMIN_SERVER_DELETE_ERROR_PARAMS);
		}

		await deleteServerAdmin(serverid);

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, null, ADMIN_MESSAGES.ADMIN_SERVER_DELETE_SUCCESSFUL);
	} catch (err) {
		Logger.error(ADMIN_MESSAGES.ADMIN_SERVER_DELETE_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, ADMIN_MESSAGES.ADMIN_SERVER_DELETE_GENERAL_ERROR);
	}
};

export const getMapList = async (req, res) => {
	try {
		const getMaps = await pool.query(`SELECT * FROM l4d2_maps WHERE status = 1`);
		res.json(getMaps);
	} catch (err) {
		res.json(errors.response(HTTP_STATUS.BAD_REQUEST, err));
	}
};
