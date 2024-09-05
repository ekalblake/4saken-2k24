import pool from "../database.js";
import errors from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";

export const failedUser = async (req, res) => {
	return res.json(
		errors.response(HTTP_STATUS.UNAUTHORIZED, "No se pudo iniciar sesión, contáctate con un administrador."),
	);
};

export const registerUser = async (req, res) => {
	try {
		const steamid = req.user.id;

		const getUserInfo = await pool.query(
			`SELECT
                    users_general.UserID,
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
                    CASE
                         WHEN users_mmr.GamesPlayed < 8 THEN 0
                         ELSE users_mmr.Rating
                    END AS Rating,
                    users_mmr.GamesPlayed,
                    users_mmr.LastGame,
                    users_mmr.Wins,
                    CASE
                         WHEN duel_mmr.GamesPlayed < 8 THEN 0
                         ELSE duel_mmr.Rating
                    END AS Rating,
                    duel_mmr.GamesPlayed,
                    duel_mmr.LastGame,
                    duel_mmr.Wins
                    FROM users_general
                    INNER JOIN users_web 
                         ON users_web.WebID = users_general.WebID
                    INNER JOIN users_permisions 
                         ON users_permisions.PermisionsID = users_general.PermisionsID
                    INNER JOIN users_mmr 
                         ON users_mmr.Pug_MMRID = users_general.Pug_MMRID
                    INNER JOIN duel_mmr
                         ON duel_mmr.Duel_MMRID = users_general.Duel_MMRID
                    WHERE users_general.SteamID64 = ?`,
			[steamid],
		);

		//Selecciona los datos de usuario con respecto a la sesión.
		req.session.userid = getUserInfo[0].UserID;
		console.log(getUserInfo[0].UserID);
		console.log(req.session.userid);
		return res.json(getUserInfo[0]);
	} catch (err) {
		console.log(err);
		return res.json(
			errors.response(
				HTTP_STATUS.UNAUTHORIZED,
				"No se pudo obtener información del usuario, por favor comunicate con un administrador.",
			),
		);
	}
};

export const listUser = async (req, res) => {
	try {
		const getUsers = await pool.query(`SELECT users_general.UserID,
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
	const getOnlineUsers = await pool.query(`SELECT
                                                       users_general.UserID,
                                                       users_general.SteamID64,
                                                       users_web.avatarfull,
                                                       users_web.personaname,
                                                       users_web.timecreated,
                                                       users_web.profileurl,
                                                       users_web.colorChat,
                                                       users_web.glowColor,
                                                       users_mmr.GamesPlayed,
                                                       CASE
                                                            WHEN users_mmr.GamesPlayed < 8 THEN 0
                                                            ELSE users_mmr.Rating
                                                       END AS Rating,
                                                       users_mmr.GamesPlayed,
                                                       CASE
                                                            WHEN users_mmr.GamesPlayed < 8 THEN 0
                                                            ELSE users_mmr.Rating
                                                       END AS Rating
                                                       FROM 4saken.users_general
                                                       INNER JOIN users_web ON users_general.WebID = users_web.WebID
                                                       INNER JOIN users_mmr ON users_general.Pug_MMRID = users_mmr.Pug_MMRID
                                                       INNER JOIN duel_mmr ON users_general.Duel_MMRID = duel_mmr.Duel_MMRID
                                                       WHERE users_web.isonline = 1
                                                       ORDER BY personaname ASC`);

	if (!getOnlineUsers) return res.json(errors.response(HTTP_STATUS.NOT_FOUND, "No hay jugadores en linea"));

	return res.json(getOnlineUsers);
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

export const getConnectionStatus = async (req, res) => {
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
	res.json(getStatus);
};
