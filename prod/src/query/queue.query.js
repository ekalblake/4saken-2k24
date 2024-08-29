import { HTTP_STATUS } from "../config";
import pool from "../database";
import { responseError, sqlResponse } from "../utils/errors";

let sessionTime = 0;

export const joinQueue = async (region, userInfo) => {
	return new Promise(async (resolve, reject) => {
		const { UserID } = userInfo;

		let joinTime = Math.floor(new Date().getTime() / 1000);

		try {
			const [checkQueue] = await pool.query(
				`SELECT 
                    userid
                FROM 
                    l4d2_queue
                WHERE 
                    userid = ?`,
				[UserID],
			);

			if (checkQueue) {
				return reject(responseError(HTTP_STATUS.BAD_REQUEST, null, "Ya estás en la cola"));
			}

			if (sessionTime !== 0 && joinTime - sessionTime <= 5) {
				const waitTime = Math.ceil((5 - (joinTime - sessionTime)) / 1000);
				return reject(responseError(HTTP_STATUS.BAD_REQUEST, null, `Vuelve a unirte en ${waitTime} segundos.`));
			}

			//TODO: Quitar luego
			let unixTimestamp = Math.floor(Date.now() / 1000);

			await pool.query(
				`INSERT INTO l4d2_queue (userid, region, joined_date)
                VALUES (?, ?, ?)`,
				[UserID, region, unixTimestamp],
			);

			getUserInformation(UserID)
				.then((response) => {
					resolve(response);
				})
				.catch((err) => {
					console.log(err);
					reject(sqlResponse(err));
				});
		} catch (err) {
			reject(sqlResponse(err));
		}
	});
};

export const dropQueue = async (userid) => {
	return new Promise(async (resolve, reject) => {
		try {
			let dropQueue = await pool.query(`DELETE FROM 4saken.l4d2_queue  WHERE userid = ?`, [userid]);

			if (dropQueue.affectedRows != 1)
				return reject(
					responseError(HTTP_STATUS.BAD_REQUEST, null, "No puedes salir de la cola si no estás en alguna."),
				);

			sessionTime = Math.floor(new Date().getTime() / 1000);

			resolve();
		} catch (err) {
			reject(sqlResponse(err));
		}
	});
};

export const verifyQueue = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			const players = pool.query(`SELECT userid, region, joined_date from 4saken.l4d2_queue`);
			resolve(players);
		} catch (err) {
			reject(sqlResponse(err));
		}
	});
};

const getUserInformation = async (userId) => {
	return new Promise((resolve, reject) => {
		pool.query(
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
             users_web.timecreated,
             users_web.personastate,
             users_web.colorChat,
             users_web.glowColor,
             users_web.created_at,
             users_permisions.Rol,
             users_permisions.IsPremium,
             users_mmr.Rating,
             users_mmr.GamesPlayed,
             users_mmr.LastGame,
             users_mmr.Wins
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
            WHERE l4d2_queue.userid = ?`,
			[userId],
			(err, results) => {
				if (err) {
					return reject(sqlResponse(err));
				}
				resolve(results[0]);
			},
		);
	});
};
