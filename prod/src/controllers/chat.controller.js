import validator from "validator";

import pool from "../database.js";
import errors, { sendResponse } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

import { addMessage, getMessageList } from "../models/chatModel.js";

import Logger from "../utils/logger.js";
import { CHAT_MESSAGES } from "../utils/constants.js";

export const getMessages = async (req, res) => {
	Logger.request(req);

	const { room } = req.params;

	if (!validator.isAlphanumeric(room)) {
		Logger.error(CHAT_MESSAGES.CHAT_LIST_INVALID_PARAM, null, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, CHAT_MESSAGES.CHAT_LIST_INVALID_PARAM);
	}

	try {
		const response = await getMessageList(room);

		Logger.response(req, res, response);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response.reverse(), CHAT_MESSAGES.CHAT_LIST_SUCCESSFUL);
	} catch (err) {
		Logger.error(CHAT_MESSAGES.CHAT_LIST_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, CHAT_MESSAGES.CHAT_LIST_GENERAL_ERROR);
	}
};

export const sendMessage = async (req, res) => {
	Logger.request(req);
	try {
		const { message_type, message_data } = req.body;

		const { room } = req.params;

		const { userid } = req.session;

		if (!validator.isAlphanumeric(room)) {
			Logger.error(CHAT_MESSAGES.CHAT_SEND_MESSAGE_INVALID_PARAM, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, CHAT_MESSAGES.CHAT_SEND_MESSAGE_INVALID_PARAM);
		}

		let currentTime = Math.floor(new Date().getTime() / 1000);

		if (req.session.sendTime > currentTime) {
			req.session.sendTime = 0;

			Logger.error(CHAT_MESSAGES.CHAT_SEND_MESSAGE_FAST, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, CHAT_MESSAGES.CHAT_SEND_MESSAGE_FAST);
		}

		let unixTimestamp = Math.floor(Date.now() / 1000);

		const response = await addMessage(userid, message_type, JSON.stringify(message_data), room, unixTimestamp);

		req.session.sendTime = Math.floor(new Date().getTime() / 1000) + 2;

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, CHAT_MESSAGES.CHAT_LIST_SUCCESSFUL);
	} catch (err) {
		Logger.error(CHAT_MESSAGES.CHAT_SEND_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, CHAT_MESSAGES.CHAT_SEND_GENERAL_ERROR);
	}
};

/* export const deleteMessageAsAdmin = async (req, res) => {
	try {
		const { chatid } = req.params;

		//Verificar si el usuario actual es administrador a través de la sesión
		const isAdmin = req.session.userid;
		console.log(isAdmin);
		let verifyAdmin = await pool.query(
			`SELECT 
                                                       users_permisions.Rol
                                                       FROM 
                                                            users_general
                                                       INNER JOIN
                                                            users_permisions
                                                       ON
                                                            users_general.UserID = users_permisions.PermisionsID
                                                       WHERE 
                                                            users_general.UserID = ?`,
			[isAdmin],
		);

		if (verifyAdmin[0].Rol != 2)
			return res
				.status(HTTP_STATUS.BAD_REQUEST)
				.json(errors.response(HTTP_STATUS.BAD_REQUEST, "No eres admin para hacer esto."));

		//Borrar el mensaje
		let deleteMessage = await pool.query(
			`DELETE FROM 
                                                                 4saken.chat_room
                                                       WHERE 
                                                            chatid = ?`,
			[chatid],
		);

		if (deleteMessage.affectedRows != 1)
			return res
				.status(HTTP_STATUS.NOT_ACCEPTABLE)
				.json(errors.response(HTTP_STATUS.NOT_ACCEPTABLE, "No se ha podido borrar el mensaje."));

		return res.json(errors.success(HTTP_STATUS.SUCCESSFUL, "You have delete a message."));
	} catch (err) {
		console.log(err);
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(
				errors.success(
					HTTP_STATUS.NOT_ACCEPTABLE,
					"Error en borrar mensaje como admin, comunicate con el desarrollador.",
				),
			);
	}
}; */
