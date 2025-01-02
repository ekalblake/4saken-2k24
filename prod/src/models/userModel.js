import { HTTP_STATUS } from "../config.js";
import pool from "../database.js";
import { responseError, responseSuccess, sqlResponse } from "../utils/errors.js";
import { getRandomCode } from "../utils/helpers.js";

export const getSteamIdById = async (userid) =>
	await pool.query(`SELECT SteamID64 FROM users_general WHERE UserID = ? LIMIT 1`, [userid]);

export const getBannedById = async (steamid) =>
	await pool.query(
		`SELECT * FROM forsaken_sourcebans.sb_bans WHERE authid = ? AND (ends > UNIX_TIMESTAMP() OR length = 0) ORDER BY bid DESC LIMIT 1`,
		[steamid],
	);

export const getUserBySteamID = async (steamID64) => {
	const [verifyUserExist] = await pool.query(
		`
		SELECT 
			SteamID64 
		FROM 
			users_general 
		WHERE 
			SteamID64 = ?`,
		[steamID64],
	);
	return verifyUserExist;
};

export const createUser = async (steamUser, steamID64, index) => {
	const conn = await pool.promise().getConnection();
	try {
		await conn.beginTransaction();

		await conn.query(`INSERT INTO users_web SET ?`, steamUser);

		await conn.query(
			`INSERT INTO 
				users_general (SteamID64, WebID, Pug_MMRID, Duel_MMRID, PermisionsID)
             VALUES 
			 	(?,?,?,?,?)`,
			[steamID64, index, index, index, index],
		);

		await conn.commit();
	} catch (error) {
		await conn.rollback();
		throw error;
	} finally {
		conn.release();
	}
};

export const updateUser = async (steamID64, { personaname, avatarfull, personastate }) => {
	await pool.query(
		`UPDATE 
			users_web uw
         JOIN 
		 	users_general ug 
		ON 
			uw.WebID = ug.UserID
         SET 
		 	uw.personaname = ?,
			uw.avatarfull = ?,
			uw.personastate = ?
         WHERE 
		 	ug.SteamID64 = ?`,
		[personaname, avatarfull, personastate, steamID64],
	);
};

export const fetchUserInformation = async (steamid) => {
	const [getUserInfo] = await pool.query(
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
			users_web.regions,
			users_web.created_at,
			users_permisions.Rol,
			users_permisions.IsPremium,
			CASE
					WHEN users_mmr.GamesPlayed < 8 THEN 0
					ELSE users_mmr.Rating
			END AS Rating,
			users_mmr.GamesPlayed as GamesPlayed,
			users_mmr.LastGame,
			users_mmr.Wins,
			CASE
					WHEN duel_mmr.GamesPlayed < 8 THEN 0
					ELSE duel_mmr.Rating
			END AS RatingDuel,
			duel_mmr.GamesPlayed as DuoGamesPlayed,
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
			WHERE users_general.SteamID64 = ? LIMIT 1`,
		[steamid],
	);
	return getUserInfo;
};

export const onlineUserList = async () => {
	const getOnlineUsers = await pool.query(
		`
		SELECT
			users_general.UserID,
			users_general.SteamID64,
			users_web.avatarfull,
			users_web.personaname,
			users_web.timecreated,
			users_web.profileurl,
			users_web.colorChat,
			users_web.glowColor,
			users_mmr.GamesPlayed as GamesPlayed,
			duel_mmr.GamesPlayed as GamesPlayedDuel,
			CASE
				WHEN 
					users_mmr.GamesPlayed < 8 THEN 0
				ELSE 
					users_mmr.Rating
				END AS 
					Rating,
			CASE
				WHEN 
					users_mmr.GamesPlayed < 8 THEN 0
				ELSE 
					users_mmr.Rating
				END AS 
					Rating,
			users_mmr.LastGame,
			users_mmr.Wins,
			CASE
				WHEN 
					duel_mmr.GamesPlayed < 8 THEN 0
				ELSE 
					duel_mmr.Rating
				END AS 
					Rating,
			CASE
				WHEN 
					duel_mmr.GamesPlayed < 8 THEN 0
				ELSE 
					duel_mmr.Rating
				END AS 
					RatingDuel,
			duel_mmr.LastGame,
			duel_mmr.Wins
		FROM 
			users_general
		INNER JOIN 
			users_web 
		ON 
			users_general.WebID = users_web.WebID
		INNER JOIN 
			users_mmr 
		ON 
			users_general.Pug_MMRID = users_mmr.Pug_MMRID
		INNER JOIN 
			duel_mmr 
		ON 
			users_general.Duel_MMRID = duel_mmr.Duel_MMRID
		WHERE 
			users_web.isonline = 1
		ORDER BY 
			personaname 
		ASC`,
	);

	return getOnlineUsers;
};

export const updateRegionUser = async (region, userid) => {
	await pool.query(
		`UPDATE
			users_web
		SET
			regions = ?
		WHERE
			WebID = ?`,
		[region, userid],
	);
};

export const newParty = async (userid) => {
	const partyCode = getRandomCode();

	const result = await pool.query(
		`
		INSERT INTO 
			party (party_code, leader_id) 
		VALUES (?, ?)`,
		[partyCode, userid],
	);

	const partyId = result.insertId;

	await pool.query(
		`
		UPDATE 
			users_web 
		SET 
			party_id = ? 
		WHERE 
			WebID = ?`,
		[partyId, userid],
	);
};

export const verifyParty = async (userid) => {
	const [partyResult] = await pool.query(
		`
		SELECT 
			party_id 
		FROM 
			users_web 
		WHERE 
			WebID = ?`,
		[userid],
	);

	if (!partyResult || partyResult.party_id === null) {
		return [];
	}

	const partyId = partyResult.party_id;

	const members = await pool.query(
		`
				SELECT 
					ug.UserID, 
					uw.personaname,
					uw.avatarfull,
					uw.profileurl,
					uw.colorChat,
					uw.glowColor
				FROM 
					users_web uw
				JOIN 
					party_members pm 
				ON 
					pm.user_id = uw.WebID
				JOIN
					users_general ug
				ON
					pm.user_id = ug.UserID
				WHERE 
					pm.party_id = ? `,
		[partyId],
	);

	const [partyInfo] = await pool.query(
		`
				SELECT 
					p.party_id, 
					p.leader_id, 
					p.party_code,
					uw.personaname AS leader_name, 
					uw.avatarfull,
					uw.profileurl,
					uw.colorChat,
					uw.glowColor,
					p.status
				FROM 
					party p
				JOIN 
					users_web uw 
				ON 
					uw.WebID = p.leader_id
				WHERE 
					p.party_id = ?`,
		[partyId],
	);

	const returnObj = {
		party: partyInfo,
		members,
	};
	return returnObj;
};

export const findPartyId = async (party_code) => {
	const [getPartyId] = await pool.query(
		`
		SELECT 
			party_id
		FROM
			party
		WHERE
			party_code = ? `,
		[party_code],
	);

	return getPartyId;
};

export const joinNewParty = async (userid, party_id) => {
	await pool.query(
		`
		INSERT INTO 
			party_members (party_id, user_id) 
		VALUES (?,?)`,
		[party_id, userid],
	);

	await pool.query(
		`
		UPDATE 
			users_web 
		SET 
			party_id = ? 
		WHERE 
		WebID = ?`,
		[party_id, userid],
	);
};

export const dropPartyMember = async (userid, party_id) => {
	await pool.query(
		`
		DELETE FROM 
			party_members 
		WHERE 
			party_id = ? AND user_id = ?;

		`,
		[party_id, userid],
	);

	await pool.query(
		`
		UPDATE 
			users_web 
		SET 
			party_id = NULL 
		WHERE 
			WebID = ?`,
		[userid],
	);
};

export const verifyPartyMembers = async (party_id) => {
	const [partyLeaderId] = await pool.query(
		`
		SELECT 
			leader_id 
		FROM 
			party 
		WHERE 
			party_id = ?`,
		[party_id],
	);

	const partyMembers = await pool.query(
		`
		SELECT 
			user_id 
		FROM 
			party_members 
		WHERE 
			party_id = ?`,
		[party_id],
	);

	const result = [
		partyLeaderId?.leader_id,
		...(partyMembers?.length ? partyMembers.map((member) => member.user_id) : []),
	];

	return result;
};

export const dropParty = async (userid, party_id) => {
	const getPartyUsers = await pool.query(
		`
			SELECT
				user_id
			FROM
				party_members
			WHERE
				party_id = ?
		`,
		[party_id],
	);

	await pool.query(
		`
		DELETE FROM 
			party 
		WHERE 
			leader_id = ?
		`,
		[userid],
	);

	if (getPartyUsers.length > 0) {
		await Promise.all(
			getPartyUsers.map(async (user) => {
				await pool.query(
					`
			  UPDATE 
				users_web 
			  SET 
				party_id = NULL 
			  WHERE 
				WebID = ?
			  `,
					[user.WebID],
				);
			}),
		);

		return getPartyUsers.map((user) => user.user_id);
	} else {
		return [];
	}
};

export const getCurrentGameId = async (userid) => {
	const [currentGame] = await pool.query(
		`
		SELECT
			game_id,
			personaname
		FROM
			users_web
		WHERE
			WebID = ?
		`,
		[userid],
	);

	if (!currentGame.game_id) {
		return null;
	}

	return currentGame;
};

export const getCurrentGame = async (gameid) => {
	const [currentGame] = await pool.query(
		`
		SELECT
			*
		FROM
			l4d2_queue_game
		WHERE
			gameid = ?
		`,
		[gameid],
	);

	return currentGame;
};

export const getUserList = async () => {
	const getUsers = await pool.query(
		`
			SELECT 
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
				IF(users_mmr.GamesPlayed < 8, 0, users_mmr.Rating) AS Rating,
				users_mmr.GamesPlayed,
				IF(duel_mmr.GamesPlayed < 8, 0, duel_mmr.Rating) AS SoloRating
			FROM 
				users_general
			INNER JOIN 
				users_web 
			ON 
				users_web.WebID = users_general.WebID
			INNER JOIN 
				users_permisions 
			ON 
				users_permisions.PermisionsID = users_general.PermisionsID
			INNER JOIN 
				users_mmr 
			ON 
				users_mmr.Pug_MMRID = users_general.Pug_MMRID
			INNER JOIN 
				duel_mmr 
			ON 
				duel_mmr.Duel_MMRID = users_general.Duel_MMRID
			WHERE 
				users_mmr.Rating IS NOT NULL
			ORDER BY 
				users_mmr.Rating DESC`,
	);

	return getUsers;
};

export const connectionStatus = async () => {
	return await pool.query(
		`
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
		`,
	);
};

export const updateConfig = async (colorChat, glowColor, userid) => {
	await pool.query(
		`
				UPDATE
					users_web
				SET 
					colorChat = ?,
					glowColor = ?
				WHERE
					WebID = ?`,
		[colorChat, glowColor, userid],
	);
};

export const getUserMMR = async (steamid) => {
	await pool.query(
		`
		SELECT
			users_mmr.Rating,
			users_mmr.Deviation,
			users_mmr.GamesPlayed
		FROM 
			users_general 
		INNER JOIN 
			users_mmr
		ON 
			users_general.UserID = users_mmr.MMRID
		WHERE 
			users_general.SteamID64 = ?
		LIMIT
			1`,
		[steamid],
	);
};
