import pool from "../database.js";
import errors, { responseError, sendResponse, sendResponseObj } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

import {
	dropParty,
	dropPartyMember,
	fetchUserInformation,
	findPartyId,
	getCurrentGame,
	getCurrentGameId,
	joinNewParty,
	newParty,
	onlineUserList,
	updateRegionUser,
	verifyParty,
	verifyPartyMembers,
} from "../models/userModel.js";
import Logger from "../utils/logger.js";

import { USER_MESSAGES } from "../utils/constants.js";

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
	try {
		const getUsers = await pool.query(`
			SELECT users_general.UserID,
				users_general.SteamID64,
				users_web.personaname,
				users_web.avatarfull,
				users_web.profileurl,
				users_web.timecreated,
				users_web.personastate,
				users_web.colorChat,
				users_web.glowColor,
				users_web.created_at,
				users_permisions.Rol,
				users_permisions.IsPremium,
				IF(users_mmr.GamesPlayed < 8, 0, users_mmr.Rating) AS Rating,
				users_mmr.GamesPlayed,
				IF(duel_mmr.GamesPlayed < 8, 0, duel_mmr.Rating) AS SoloRating
			FROM users_general
			INNER JOIN users_web ON users_web.WebID = users_general.WebID
			INNER JOIN users_permisions ON users_permisions.PermisionsID = users_general.PermisionsID
			INNER JOIN users_mmr ON users_mmr.Pug_MMRID = users_general.Pug_MMRID
			INNER JOIN duel_mmr ON duel_mmr.Duel_MMRID = users_general.Duel_MMRID
			WHERE users_mmr.Rating IS NOT NULL
			ORDER BY users_mmr.Rating DESC`);

		return res.json(getUsers);
	} catch (err) {
		console.log(err);
		return res.json(errors.response(HTTP_STATUS.NOT_FOUND, "There are not any players registered"));
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

		console.log(partyId);

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

	const { party_id } = req.params;

	try {
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

export const getConnectionStatus = async (req, res) => {
	Logger.request(req);
	try {
		const [getStatus] = await pool.query(`
			  SELECT 
				   COUNT(if(users_web.isonline = 1,1,null)) as onlineUser, 
				   COUNT(if(users_web.isonline = 1 and users_permisions.Rol=2,1,null)) as onlineAdmins 
			  FROM 
				   users_general 
			  INNER JOIN 
				   users_web 
			  ON  
				   users_web.WebID =  users_general.UserID
			  INNER JOIN 
				   users_permisions 
			  ON 
				   users_permisions.PermisionsID = users_general.UserID
		  `);

		Logger.response(req, res);

		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, getStatus, USER_MESSAGES.USER_GET_CONNECTION_SUCCESSFUL);
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

export const configUser = async (req, res) => {
	try {
		const { colorChat, glowColor, userid } = req.body;

		const useridSession = req.session.userid;

		const updateInfo = {
			colorChat,
			glowColor,
			userid,
		};

		if (updateInfo.userid != useridSession)
			return res.json(
				errors.response(
					HTTP_STATUS.UNAUTHORIZED,
					"This is not your account to update this configuration. Don't be silly.",
				),
			);

		await pool.query(
			`UPDATE
                                4saken.l4d2_users
                                SET colorChat = ?,
                                glowColor = ?
                                WHERE userid = ?`,
			[updateInfo.colorChat, updateInfo.glowColor, useridSession],
		);

		return res.json(errors.success(HTTP_STATUS.SUCCESSFUL, "Saved."));
	} catch (err) {
		console.log(err);
		res.json(
			errors.response(
				HTTP_STATUS.BAD_REQUEST,
				"There was an error while saving your configuration, contact an Admin please.",
			),
		);
	}
};

export const getUserMmr = async (req, res) => {
	try {
		const steamid = req.query.steamid;

		let getUserMmr = await pool.query(
			`SELECT
                                                       users_mmr.Rating,
                                                       users_mmr.Deviation,
                                                       users_mmr.GamesPlayed
                                                       FROM users_general 
                                                       INNER JOIN users_mmr
                                                            ON users_general.UserID = users_mmr.MMRID
                                                       WHERE users_general.SteamID64 = ?`,
			[steamid],
		);

		if (getUserMmr.length == 0)
			return res.json(errors.response(HTTP_STATUS.NOT_FOUND, "No se ha encontrado el jugador"));

		if (getUserMmr[0].GamesPlayed < 8) return res.json({ GamesPlayed: getUserMmr[0].GamesPlayed });

		const newArray = {
			Rating: getUserMmr[0].Rating,
			Deviation: getUserMmr[0].Deviation,
		};

		return res.json(newArray);
	} catch (err) {
		console.log(err);
	}
};
