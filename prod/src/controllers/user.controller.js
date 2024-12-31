import pool from "../database.js";
import errors, { responseError, sendResponse, sendResponseObj } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

import {
	connectionStatus,
	dropParty,
	dropPartyMember,
	fetchUserInformation,
	findPartyId,
	getCurrentGame,
	getCurrentGameId,
	getUserList,
	getUserMMR,
	joinNewParty,
	newParty,
	onlineUserList,
	updateConfig,
	updateRegionUser,
	verifyParty,
	verifyPartyMembers,
} from "../models/userModel.js";
import Logger from "../utils/logger.js";

import { USER_MESSAGES } from "../utils/constants.js";
import { serverAvailabilityService } from "../services/extraServices.js";
import { getActiveServers } from "../models/generalModel.js";

export const failedUser = async (req, res) => {
	return res.json(
		errors.response(HTTP_STATUS.UNAUTHORIZED, "No se pudo iniciar sesión, contáctate con un administrador."),
	);
};

export const fetchUser = async (req, res) => {
	Logger.request(req);
	try {
		const response = await fetchUserInformation(req.user.id);

		req.session.userid = response.UserID;
		req.session.steamid = response.SteamID64;

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, USER_MESSAGES.USER_INFORMATION_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_INFORMATION_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_INFORMATION_GENERAL_ERROR);
	}
};

export const listUser = async (req, res) => {
	Logger.request(req);
	try {
		const response = await getUserList();

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, USER_MESSAGES.USER_LIST_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_LIST_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_LIST_GENERAL_ERROR);
	}
};

export const onlineListUser = async (req, res) => {
	Logger.request(req);

	try {
		const response = await onlineUserList();

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, USER_MESSAGES.USER_ONLINE_LIST_SUCCESS);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_ONLINE_LIST_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_ONLINE_LIST_GENERAL_ERROR);
	}
};

export const updateRegion = async (req, res) => {
	const { regions } = req.body;

	try {
		if (!regions) {
			Logger.error(USER_MESSAGES.USER_REGION_ERROR_PARAM, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_REGION_ERROR_PARAM);
		}

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, null, USER_MESSAGES.USER_REGION_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_REGION_ERROR_GENERAL, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_REGION_ERROR_GENERAL);
	}
};

export const createParty = async (req, res) => {
	Logger.request(req);

	const { userid } = req.session;

	try {
		await newParty(userid);

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, null, USER_MESSAGES.USER_PARTY_CREATE_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_PARTY_CREATE_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_PARTY_CREATE_ERROR);
	}
};

export const checkParty = async (req, res) => {
	Logger.request(req);

	const { userid } = req.session;

	try {
		const response = await verifyParty(userid);

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, USER_MESSAGES.USER_PARTY_VERIFICATION_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_PARTY_VERIFICATION_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_PARTY_VERIFICATION_ERROR);
	}
};

export const joinParty = async (req, res) => {
	Logger.request(req);
	const { userid } = req.session;
	const { party_code } = req.body;

	if (!party_code) {
		Logger.error(USER_MESSAGES.USER_PARTY_JOIN_MEMBER_ERROR_PARAMS, null, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_PARTY_JOIN_MEMBER_ERROR_PARAMS);
	}

	try {
		const partyId = await findPartyId(party_code);

		if (!partyId) {
			Logger.error(USER_MESSAGES.USER_PARTY_JOIN_NOT_FOUND, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, USER_MESSAGES.USER_PARTY_JOIN_NOT_FOUND);
		}

		await joinNewParty(userid, partyId.party_id);

		const currentPartyMembers = await verifyPartyMembers(partyId.party_id);

		Logger.response(req, res);

		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, currentPartyMembers, USER_MESSAGES.USER_PARTY_JOIN_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_PARTY_JOIN_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_PARTY_JOIN_GENERAL_ERROR);
	}
};

export const removePartyMember = async (req, res) => {
	Logger.request(req);

	const { userid } = req.session;
	const { party_id } = req.params;

	if (!party_id) {
		Logger.error(USER_MESSAGES.USER_PARTY_DROP_MEMBER_ERROR_PARAM, null, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_PARTY_DROP_MEMBER_ERROR_PARAM);
	}

	try {
		await dropPartyMember(userid, party_id);

		const currentPartyMembers = await verifyPartyMembers(party_id);

		Logger.response(req, res);

		return sendResponse(
			res,
			HTTP_STATUS.SUCCESSFUL,
			currentPartyMembers,
			USER_MESSAGES.USER_PARTY_DROP_MEMBER_SUCCESSFUL,
		);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_PARTY_DROP_MEMBER_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_PARTY_DROP_MEMBER_GENERAL_ERROR);
	}
};

export const deleteParty = async (req, res) => {
	Logger.request(req);

	const { userid } = req.session;

	try {
		const { party_id } = req.params;

		if (!party_id) {
			Logger.error(USER_MESSAGES.USER_PARTY_DROP_ERROR_PARAM, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_PARTY_DROP_ERROR_PARAM);
		}

		const currentPartyMembers = await dropParty(userid, party_id);

		Logger.response(req, res);

		return sendResponse(
			res,
			HTTP_STATUS.SUCCESSFUL,
			currentPartyMembers,
			USER_MESSAGES.USER_PARTY_DROP_SUCCESSFULL,
		);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_PARTY_DROP_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_PARTY_DROP_GENERAL_ERROR);
	}
};

export const getServerListPublic = async (req, res) => {
	Logger.request(req);
	try {
		const getServers = await getActiveServers(["FREE", "RESERVED"]);

		var availableServers = [];

		for (let server of getServers) {
			try {
				const data = await serverAvailabilityService(server.ip, server.port);
				const nombreJugador = data.players.map((l) => {
					return l.name;
				});
				availableServers.push({
					name: data.name,
					map: data.map,
					numplayers: data.raw.numplayers,
					players: nombreJugador,
					maxplayers: data.maxplayers,
					ip: data.connect,
					ping: data.ping,
				});
			} catch (err) {
				console.log(`No se ha encontrado el servidor: ${server.ip} - ${err.message}`);
			}
		}

		Logger.response(req, res);
		return sendResponse(
			res,
			HTTP_STATUS.SUCCESSFUL,
			availableServers,
			USER_MESSAGES.USER_LIST_SERVER_PUBLIC_SUCCESSFUL,
		);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_LIST_SERVER_PUBLIC_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_LIST_SERVER_PUBLIC_GENERAL_ERROR);
	}
};

export const getConnectionStatus = async (req, res) => {
	Logger.request(req);
	try {
		const [response] = await connectionStatus();
		Logger.response(req, res);

		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, USER_MESSAGES.USER_GET_CONNECTION_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_GET_CONNECTION_STATUS_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_GET_CONNECTION_STATUS_ERROR);
	}
};

export const checkCurrentGame = async (req, res) => {
	Logger.request(req);

	const { userid } = req.session;

	try {
		const gameId = await getCurrentGameId(userid);

		let gameObj = null;

		if (gameId) {
			const response = await getCurrentGame(gameId.game_id);
			gameObj = {
				gameid: response.gameid,
				teamA: JSON.parse(response.teamA),
				teamB: JSON.parse(response.teamB),
				room: response.room,
				status: response.status,
				map: response.map,
				region: response.region,
				ip: response.ip,
				mmr_average: response.mmr_average,
				gamestarted: response.gamestarted,
			};
		}

		Logger.response(req, res);

		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, gameObj, USER_MESSAGES.USER_CURRENT_GAME_SUCCESS);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_CURRENT_GAME_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, err, USER_MESSAGES.USER_CURRENT_GAME_GENERAL_ERROR);
	}
};

export const userConfiguration = async (req, res) => {
	Logger.request(req);

	try {
		const { colorChat, glowColor } = req.body;

		const { userid } = req.session;

		const update = updateConfig(colorChat, glowColor, userid);

		if (update.affectedRows == 0) {
			Logger.error(USER_MESSAGES.USER_CONFIG_NOT_UPDATED, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, USER_MESSAGES.USER_CONFIG_NOT_UPDATED);
		}

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, null, USER_MESSAGES.USER_CONFIG_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_CONFIG_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, USER_MESSAGES.USER_CONFIG_GENERAL_ERROR);
	}
};

export const getUserMmr = async (req, res) => {
	try {
		const { steamid } = req.query;

		if (!steamid) {
			Logger.error(USER_MESSAGES.USER_MMR_PARAMS_ERROR, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_MMR_PARAMS_ERROR);
		}

		let [getUserMmr] = await getUserMMR(steamid);

		if (!getUserMmr) {
			Logger.error(USER_MESSAGES.USER_MMR_NOT_FOUND_STEAM, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, response, USER_MESSAGES.USER_MMR_NOT_FOUND_STEAM);
		}

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, getUserMmr, USER_MESSAGES.USER_CONFIG_SUCCESSFUL);
	} catch (err) {
		Logger.error(USER_MESSAGES.USER_MMR_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, USER_MESSAGES.USER_MMR_GENERAL_ERROR);
	}
};
