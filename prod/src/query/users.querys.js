import pool from "../database.js";

export const getSteamIdById = async (userid) => await pool.query(`SELECT SteamID64 FROM users_general WHERE UserID = ? LIMIT 1`,[userid])

export const getBannedById = async (steamid) => await pool.query(`SELECT * FROM forsaken_sourcebans.sb_bans WHERE authid = ? AND (ends > UNIX_TIMESTAMP() OR length = 0) ORDER BY bid DESC LIMIT 1`, [steamid])

/**
 * Queue Events
 */

//Insert Queue

//Update Queue
export const queryUpdatePlayer = async (userid) => await pool.query('UPDATE 4saken.l4d2_queue SET isjoined = 2 WHERE userid = ?', [userid])


//Drop Queue
export const queryDropPlayerQueue = async ( userid ) => await pool.query('DELETE FROM `4saken`.l4d2_queue  WHERE userid = ?', [userid]);
export const queryUpdatePlayerStatus = async (region) => await pool.query('UPDATE 4saken.l4d2_queue SET isjoined = 1 WHERE region = ?',[region])




export const queryPlayersVerify   = async (region)  => await pool.query('SELECT * FROM 4saken.l4d2_queue WHERE (isjoined = 1 OR isjoined = 2) and region = ?', [region])
export const queryPlayersVerifyCounter = async (region) => await pool.query('SELECT * FROM 4saken.l4d2_queue where region = ?', [region])
export const queryVerifyUnreadyPlayers = async (region) => await pool.query('SELECT * FROM 4saken.l4d2_queue where isjoined = 1 and region = ?', [region])
