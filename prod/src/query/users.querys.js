import pool from "../database.js";

export const getSteamIdById = async (userid) =>
	await pool.query(`SELECT SteamID64 FROM users_general WHERE UserID = ? LIMIT 1`, [userid]);

export const getBannedById = async (steamid) =>
	await pool.query(
		`SELECT * FROM forsaken_sourcebans.sb_bans WHERE authid = ? AND (ends > UNIX_TIMESTAMP() OR length = 0) ORDER BY bid DESC LIMIT 1`,
		[steamid],
	);

/**
 * Queue Events
 */

//Insert Queue

//Update Queue
export const queryUpdatePlayer = async (userid) =>
	await pool.query("UPDATE 4saken.l4d2_queue SET isjoined = 2 WHERE userid = ?", [userid]);

//Drop Queue
export const queryDropPlayerQueue = async (userid) =>
	await pool.query("DELETE FROM `4saken`.l4d2_queue  WHERE userid = ?", [userid]);
export const queryUpdatePlayerStatus = async (region) =>
	await pool.query("UPDATE 4saken.l4d2_queue SET isjoined = 1 WHERE region = ?", [region]);

export const queryPlayersVerify = async (region) =>
	await pool.query("SELECT * FROM 4saken.l4d2_queue WHERE (isjoined = 1 OR isjoined = 2) and region = ?", [region]);
export const queryPlayersVerifyCounter = async (region) =>
	await pool.query("SELECT * FROM 4saken.l4d2_queue where region = ?", [region]);
export const queryVerifyUnreadyPlayers = async (region) =>
	await pool.query("SELECT * FROM 4saken.l4d2_queue where isjoined = 1 and region = ?", [region]);

export const createNewUser = async (profile) => {
	return new Promise(async (resolve, reject) => {
		try {
			await pool.query("START TRANSACTION");

			const getSteamId = profile.id;

			const verifyUserExist = await pool.query(
				`SELECT 
                    SteamID64 
                FROM 
                    users_general 
                WHERE 
                    SteamID64 = ?`,
				[getSteamId],
			);

			if (verifyUserExist.length == 0) {
				const WebID = await pool.query("SELECT WebID FROM users_general ORDER BY WebID DESC LIMIT 1");

				const { personaname, avatarfull, profileurl, personastate, timecreated } = profile._json;

				const newIndex = WebID[0].WebID + 1;

				const steamUser = {
					WebID: newIndex,
					personaname,
					avatarfull,
					profileurl,
					timecreated,
					personastate,
				};

				const insertIntoWeb = await pool.query(
					`INSERT INTO 4saken.users_web
                                   SET ?
                                   ON DUPLICATE KEY UPDATE
                                   WebID = ?, 
                                     personaname = ?,
                                     avatarfull = ?,
                                     personastate = ?`,
					[
						steamUser,
						steamUser["WebID"],
						steamUser["personaname"],
						steamUser["avatarfull"],
						steamUser["personastate"],
					],
				);

				const insertId = insertIntoWeb.insertId;

				await pool.query(
					`INSERT INTO 4saken.users_general
                                (SteamID64, WebID, Pug_MMRID, Duel_MMRID, PermisionsID)
                                VALUES (?,?,?,?,?)`,
					[getSteamId, insertId, insertId, insertId, insertId],
				);
			}

			await pool.query("COMMIT");

			resolve();
		} catch (err) {
			await pool.query("ROLLBACK");
			reject(sqlResponse(err));
		}
	});
};
