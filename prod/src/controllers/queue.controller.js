import pool from "../database.js";
import errors, { responseError, responseSuccess } from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import { joinQueue, dropQueue } from "../query/queue.query.js";

export const playerJoinQueue = (req, res) => {
	const { room } = req.body;
	joinQueue(room, req.session.userid, req.session.waitTime)
		.then((response) => {
			return res.json(responseSuccess(HTTP_STATUS.SUCCESSFUL, response));
		})
		.catch((err) => {
			return res.status(err.status).json(responseError(err.status, {}, err.message));
		});
};

export const playerDropQueue = (req, res) => {
	dropQueue(req.session.userid)
		.then((response) => {
			req.session.waitTime = Math.floor(new Date().getTime() / 1000);
			return res.json(responseSuccess(HTTP_STATUS.SUCCESSFUL, response));
		})
		.catch((err) => {
			return res.status(err.status).json(responseError(err.status, {}, err.message));
		});
};

export const getQueueList = async (req, res) => {
	const { gametype } = req.params;
	try {
		const getQueue = await pool.query(
			`SELECT
               users_general.UserID,
               users_general.SteamID64,
               l4d2_queue.queueid, 
               l4d2_queue.isjoined,
               l4d2_queue.region,
               l4d2_queue.joined_date,
               users_web.avatarfull,
               users_web.personaname,
               users_web.profileurl,
               users_web.colorChat,
               users_web.glowColor,
               users_web.created_at,
               users_web.personastate,
               users_web.timecreated,
               users_permisions.Rol,
               users_permisions.IsPremium,
               users_mmr.Rating,
               users_mmr.GamesPlayed,
               users_mmr.LastGame,
               users_mmr.Wins
           FROM l4d2_queue
           JOIN users_general ON l4d2_queue.userid = users_general.UserID
           JOIN users_web ON users_general.UserID = users_web.WebID
           JOIN users_mmr ON users_general.UserID = users_mmr.Pug_MMRID
           JOIN duel_mmr ON users_general.UserID = duel_mmr.Duel_MMRID
           JOIN users_permisions ON users_general.UserID = users_permisions.PermisionsID
           WHERE l4d2_queue.region = ?`,
			[gametype],
		);

		return res.json(getQueue);
	} catch (err) {
		console.log(err);
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(errors.success(HTTP_STATUS.NOT_ACCEPTABLE, "Hubo un error, comunicate con un administrador."));
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

export const listQueue = async (req, res) => {
	try {
		let queueList = [];

		for (let i = 1; i < 5; i++) {
			const getQueues = await pool.query(
				`SELECT users_general.UserID,
							users_general.SteamID64,
							l4d2_queue.queueid, 
							l4d2_queue.isjoined,
							l4d2_queue.region,
							l4d2_queue.joined_date,
							users_web.avatarfull,
							users_web.personaname,
							users_web.profileurl,
							users_web.colorChat,
							users_web.glowColor,
							users_web.created_at,
							users_web.personastate,
							users_web.timecreated,
							users_permisions.Rol,
							users_permisions.IsPremium,
							users_mmr.Rating,
							users_mmr.GamesPlayed,
							users_mmr.LastGame,
							users_mmr.Wins,
							duel_mmr.Rating,
							duel_mmr.GamesPlayed,
							duel_mmr.LastGame,
							duel_mmr.Wins
					FROM users_general
					INNER JOIN l4d2_queue
							ON users_general.UserID = l4d2_queue.userid
					INNER JOIN users_web
							ON users_general.UserID = users_web.WebID
					INNER JOIN users_mmr
							ON users_general.UserID = users_mmr.Pug_MMRID
					INNER JOIN duel_mmr
							ON users_general.UserID = duel_mmr.Duel_MMRID
					INNER JOIN users_permisions
							ON users_general.UserID = users_permisions.PermisionsID
					WHERE region = ?`,
				[i],
			);

			queueList.push(getQueues);
		}

		return res.status(HTTP_STATUS.SUCCESSFUL).json(queueList);
	} catch (err) {
		console.log(err);
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json(errors.response(HTTP_STATUS.BAD_REQUEST, "Ocurrió un error inesperado al listar las colas."));
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
