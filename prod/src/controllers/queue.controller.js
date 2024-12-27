import pool from "../database.js";
import errors, { responseError, responseSuccess, sendResponse } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import {
	joinQueue,
	dropQueue,
	getQueueListByGame,
	verifyRegion,
	verifyQueue,
	getUserInformation,
} from "../models/queueModel.js";

import Logger from "../utils/logger.js";
import { QUEUE_MESSAGES } from "../utils/constants.js";
import { getCurrentGameId } from "../models/userModel.js";

export const playerJoinQueue = async (req, res) => {
	Logger.request(req);
	const { room } = req.body;

	if (!room || isNaN(room)) {
		Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_ROOM_NOT_FOUND, null, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, QUEUE_MESSAGES.QUEUE_JOIN_ROOM_NOT_FOUND);
	}

	try {
		let joinTime = Math.floor(new Date().getTime() / 1000);

		const checkRegions = await verifyRegion(req.session.userid);

		if (!checkRegions.regions || checkRegions.regions.length == 0) {
			Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_NOT_REGION_DETECTED, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, QUEUE_MESSAGES.QUEUE_JOIN_NOT_REGION_DETECTED);
		}

		const checkQueue = await verifyQueue(req.session.userid);

		if (checkQueue) {
			Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_ALREADY_JOINED, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, QUEUE_MESSAGES.QUEUE_JOIN_ALREADY_JOINED);
		}

		const checkGame = await getCurrentGameId(req.session.userid);
		
		if (checkGame) {
			Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_ALREADY_GAME, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, QUEUE_MESSAGES.QUEUE_JOIN_ALREADY_GAME);
		}

		if (req.session.waitTime !== 0 && joinTime - req.session.waitTime <= 5) {
			const waitTime = Math.ceil((5 - (joinTime - req.session.waitTime)) / 1000);

			Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_WAIT_TIME, null, req);
			return sendResponse(
				res,
				HTTP_STATUS.BAD_REQUEST,
				null,
				`${QUEUE_MESSAGES.QUEUE_JOIN_WAIT_TIME}: ${waitTime}`,
			);
		}

		await joinQueue(room, req.session.userid);

		const [response] = await getUserInformation(req.session.userid);

		Logger.response(req, res, response);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, QUEUE_MESSAGES.QUEUE_JOIN_SUCCESSFUL);
	} catch (err) {
		Logger.error(QUEUE_MESSAGES.QUEUE_JOIN_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, QUEUE_MESSAGES.QUEUE_JOIN_GENERAL_ERROR);
	}
};

export const playerDropQueue = (req, res) => {
	Logger.request(req);

	try {
		dropQueue(req.session.userid);

		req.session.waitTime = Math.floor(new Date().getTime() / 1000);

		Logger.response(req, res);

		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, null, QUEUE_MESSAGES.QUEUE_DROP_SUCCESSFUL);
	} catch (err) {
		Logger.error(QUEUE_MESSAGES.QUEUE_DROP_GENERAL_ERROR, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, null, QUEUE_MESSAGES.QUEUE_DROP_GENERAL_ERROR);
	}
};

export const getQueueList = async (req, res) => {
	Logger.request(req);

	try {
		const { gametype } = req.params;

		if (!gametype) {
			Logger.error(QUEUE_MESSAGES.QUEUE_LIST_ERROR_PARAM, null, req);
			return sendResponse(res, HTTP_STATUS.BAD_REQUEST, QUEUE_MESSAGES.QUEUE_JOIN_ROOM_NOT_FOUND);
		}

		const response = await getQueueListByGame(gametype);

		Logger.response(req, res);
		return sendResponse(res, HTTP_STATUS.SUCCESSFUL, response, QUEUE_MESSAGES.QUEUE_LIST_SUCCESSFUL);
	} catch (err) {
		Logger.error(QUEUE_MESSAGES.QUEUE_LIST_ERROR_GENERAL, err, req);
		return sendResponse(res, HTTP_STATUS.BAD_REQUEST, QUEUE_MESSAGES.QUEUE_LIST_ERROR_GENERAL);
	}
};

export const dropQueueAdmin = async (req, res) => {
	try {
		const { userid, region } = req.params;

		let dropQueue = await pool.query(
			`DELETE FROM 4saken.l4d2_queue
                                                       WHERE userid = ?`,
			[userid],
		);

		if (dropQueue.affectedRows != 1)
			return res
				.status(HTTP_STATUS.NOT_ACCEPTABLE)
				.json(
					errors.response(HTTP_STATUS.NOT_ACCEPTABLE, "No puedes kickear de la cola, actualiza la página."),
				);

		//Volver a todos en espera
		await pool.query(
			`UPDATE 4saken.l4d2_queue
                            SET isjoined = 1 
                            WHERE region = ?`,
			[region],
		);

		return res.json(errors.success(HTTP_STATUS.SUCCESSFUL, "Has kickeado a un jugador de la cola."));
	} catch (err) {
		console.log(err);
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(errors.success(HTTP_STATUS.NOT_ACCEPTABLE, "Hubo un error, comunicate con un administrador."));
	}
};

export const currentGames = async (req, res) => {
	try {
		const getQueues = await pool.query(`SELECT 
											teamA, 
											teamB, 
											status, 
											map, 
											ip,
											region, 
											gamestarted 
										FROM l4d2_queue_game 
										WHERE l4d2_queue_game.status = 1 
										ORDER BY queueid DESC`);

		return res.json(getQueues);
	} catch (err) {
		console.log(err);
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Ocurrió un error inesperado al listar las colas."));
	}
};
export const matchStatus = async (req, res) => {
	try {
		if (!req.query.ip || !req.query.port)
			return res
				.status(HTTP_STATUS.BAD_REQUEST)
				.json(errors.response(HTTP_STATUS.FORBIDDEN, "Rellena los campos correctamente"));

		const { ip, port } = req.query;

		const ipPort = `${ip}:${port}`;

		console.log(ipPort);

		const getMatchStatus = await pool.query(
			`SELECT 
                                                                 status 
                                                       FROM l4d2_queue_game  
                                                       WHERE ip = ?
                                                       ORDER BY queueid DESC LIMIT 1`,
			[ipPort],
		);

		//Si no existe
		if (getMatchStatus.length == 0) return 0;

		return res.json(getMatchStatus[0].status);
	} catch (err) {
		console.log(err);
		return res.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Ocurrió un error inesperado al listar las colas."));
	}
};

export const matchStatusV2 = async (req, res) => {
	try {
		if (!req.query.ip || !req.query.port)
			return res
				.status(HTTP_STATUS.BAD_REQUEST)
				.json(errors.response(HTTP_STATUS.FORBIDDEN, "Rellena los campos correctamente"));

		const { ip, port } = req.query;

		const ipPort = `${ip}:${port}`;

		const getMatchStatus = await pool.query(
			`SELECT 
                                                                 status,
                                                                 map
                                                            FROM l4d2_queue_game  
                                                            WHERE
                                                                 ip = ? 
                                                            ORDER BY queueid DESC LIMIT 1`,
			[ipPort],
		);

		if (getMatchStatus.length === 0) return res.json({ status: 0 });

		return res.status(HTTP_STATUS.SUCCESSFUL).json(getMatchStatus[0]);
	} catch (err) {
		console.log(err);
		return res.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Ocurrió un error inesperado al listar las colas."));
	}
};

export const getMatchInfo = async (req, res) => {
	try {
		if (!req.query.ip || !req.query.port)
			return res
				.status(HTTP_STATUS.FORBIDDEN)
				.json(errors.response(HTTP_STATUS.FORBIDDEN, "Rellena los campos correctamente"));

		const { ip, port } = req.query;

		const ipPort = `${ip}:${port}`;
		console.log(ipPort);
		const getMatchStatus = await pool.query(
			`SELECT
                                                                 queueid,
                                                                 teamA,
                                                                 teamB,
                                                                 region,
                                                                 map
                                                       FROM l4d2_queue_game  
                                                       WHERE ip = ?
                                                       ORDER BY queueid DESC LIMIT 1`,
			[ipPort],
		);

		if (getMatchStatus.length == 0)
			return res
				.status(HTTP_STATUS.BAD_REQUEST)
				.json(errors.response(HTTP_STATUS.BAD_REQUEST, "No devolvió ningún dato"));

		const TeamA = JSON.parse(getMatchStatus[0].teamA).map((player) => {
			const TeamA = {
				steamid: player.SteamID64,
				personaname: player.personaname,
			};

			return TeamA;
		});

		const TeamB = JSON.parse(getMatchStatus[0].teamB).map((player) => {
			const TeamB = {
				steamid: player.SteamID64,
				personaname: player.personaname,
			};

			return TeamB;
		});

		const responseArray = {
			queueid: getMatchStatus[0].queueid,
			teamA: TeamA,
			teamB: TeamB,
			region: getMatchStatus[0].region,
			map: getMatchStatus[0].map,
		};

		return res.status(HTTP_STATUS.SUCCESSFUL).json(responseArray);
	} catch (err) {
		console.log(err);
		return res.status(HTTP_STATUS.BAD_REQUEST).json("No se pudo recopilar la información");
	}
};
