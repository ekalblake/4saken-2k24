import pool from "../database.js";

export const verifyRegion = async (UserID) => {
	const [checkRegions] = await pool.query(
		`
			SELECT
				regions,
				personaname
			FROM
				users_web
			WHERE
				WebID = ?
		`,
		[UserID],
	);

	return checkRegions;
};

export const verifyQueue = async (UserID) => {
	const [checkQueue] = await pool.query(
		`SELECT 
			userid
		FROM 
			l4d2_queue
		WHERE 
			userid = ?`,
		[UserID],
	);

	return checkQueue;
};

export const joinQueue = async (room, UserID) => {
	let unixTimestamp = Math.floor(Date.now() / 1000);

	await pool.query(
		`INSERT INTO 
			l4d2_queue (userid, room, joined_date)
		VALUES 
			(?, ?, ?)`,
		[UserID, room, unixTimestamp],
	);
};

export const dropQueue = async (userid) => {
	await pool.query(
		`
		DELETE FROM
			4saken.l4d2_queue
		WHERE
			userid = ?`,
		[userid],
	);
};

export const getQueuedUsers = async () => {
	const players = await pool.query(
		`SELECT 
			l4d2_queue.userid, 
			l4d2_queue.room, 
			l4d2_queue.joined_date,
			users_general.SteamID64,
			 users_web.regions,
			users_web.avatarfull,
			users_web.personaname,
			users_web.profileurl,
			users_web.personastate,
			users_web.colorChat,
			users_web.glowColor,
			users_web.created_at,
			users_web.regions,
			users_mmr.Rating,
			users_mmr.GamesPlayed,
			users_mmr.LastGame,
			users_mmr.Wins,
			users_permisions.Rol,
			users_permisions.IsPremium
		FROM 
			l4d2_queue
		INNER JOIN
			users_web
		ON
			l4d2_queue.userid = users_web.WebID
		INNER JOIN 
			users_mmr
		ON 
			l4d2_queue.userid = users_mmr.Pug_MMRID
		INNER JOIN
			users_general
		ON
			l4d2_queue.userid = users_general.UserID
		INNER JOIN 
			users_permisions
		ON 
			l4d2_queue.userid = users_permisions.PermisionsID`,
	);

	const playerList = players.map((player) => {
		let selectedRegions = player.regions || ["NA"];
		return {
			UserID: player.userid,
			SteamID64: player.SteamID64,
			room: player.room,
			joined_date: player.joined_date,
			avatarfull: player.avatarfull,
			personaname: player.personaname,
			profileurl: player.profileurl,
			regions: selectedRegions,
			Rol: player.Rol,
			IsPremium: player.IsPremium,
			Rating: player.Rating,
			colorChat: player.colorChat,
			glowColor: player.glowColor,
			Rating: player.Rating,
			GamesPlayed: player.GamesPlayed,
			LastGame: player.LastGame,
			Wins: player.Wins,
		};
	});
	return playerList;
};

export const getQueueListByGame = async (gameType) => {
	const getQueue = await pool.query(
		`
		SELECT
			users_general.UserID,
			users_general.SteamID64,
			l4d2_queue.queueid, 
			l4d2_queue.isjoined,
			l4d2_queue.room,
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
			users_mmr.GamesPlayed,
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
			l4d2_queue
		JOIN 
			users_general 
		ON 
			l4d2_queue.userid = users_general.UserID
		JOIN 
			users_web 
		ON 
			users_general.UserID = users_web.WebID
		JOIN 
			users_mmr 
		ON 
			users_general.UserID = users_mmr.Pug_MMRID
		JOIN 
			duel_mmr 
		ON 
			users_general.UserID = duel_mmr.Duel_MMRID
		JOIN 
			users_permisions 
		ON 
			users_general.UserID = users_permisions.PermisionsID
		WHERE l4d2_queue.room = ?`,
		[gameType],
	);
	return getQueue;
};

export const getUserInformation = async (userId) => {
	const response = await pool.query(
		`
			SELECT
				users_general.UserID,
				users_general.SteamID64,
				l4d2_queue.queueid, 
				l4d2_queue.isjoined,
				l4d2_queue.room,
				l4d2_queue.joined_date,
				users_web.avatarfull,
				users_web.personaname,
				users_web.profileurl,
				users_web.timecreated,
				users_web.personastate,
				users_web.colorChat,
				users_web.glowColor,
				users_web.created_at,
				users_web.regions,
				users_permisions.Rol,
				users_permisions.IsPremium,
				users_mmr.Rating,
				users_mmr.GamesPlayed,
				users_mmr.LastGame,
				users_mmr.Wins
			FROM users_general
				INNER JOIN l4d2_queue
			ON 
				users_general.UserID = l4d2_queue.userid
			INNER JOIN 
				users_web
			ON 
				users_general.UserID = users_web.WebID
			INNER JOIN 
				users_mmr
			ON 
				users_general.UserID = users_mmr.Pug_MMRID
			INNER JOIN 
				duel_mmr
			ON 
				users_general.UserID = duel_mmr.Duel_MMRID
			INNER 
				JOIN users_permisions
			ON 
				users_general.UserID = users_permisions.PermisionsID
			WHERE 
				l4d2_queue.userid = ?
			LIMIT 1`,
		[userId],
	);
	return response;
};

export const getUserInformationGroup = async (userList) => {
	const response = await pool.query(
		`
			SELECT
				users_general.UserID,
				users_general.SteamID64,
				l4d2_queue.queueid, 
				l4d2_queue.isjoined,
				l4d2_queue.room,
				l4d2_queue.joined_date,
				users_web.avatarfull,
				users_web.personaname,
				users_web.profileurl,
				users_web.timecreated,
				users_web.personastate,
				users_web.colorChat,
				users_web.glowColor,
				users_web.created_at,
				users_web.regions,
				users_web.party_id,
				users_permisions.Rol,
				users_permisions.IsPremium,
				users_mmr.Rating,
				users_mmr.GamesPlayed,
				users_mmr.LastGame,
				users_mmr.Wins
			FROM users_general
				INNER JOIN l4d2_queue
			ON 
				users_general.UserID = l4d2_queue.userid
			INNER JOIN 
				users_web
			ON 
				users_general.UserID = users_web.WebID
			INNER JOIN 
				users_mmr
			ON 
				users_general.UserID = users_mmr.Pug_MMRID
			INNER JOIN 
				duel_mmr
			ON 
				users_general.UserID = duel_mmr.Duel_MMRID
			INNER 
				JOIN users_permisions
			ON 
				users_general.UserID = users_permisions.PermisionsID
			WHERE 
				users_web.WebID IN (?)`,
		[userList],
	);
	return response;
};

export const insertNewgame = async (game) => {
	const insertObj = {
		gameid: game.gameid,
		teamA: JSON.stringify(game.teamA),
		teamB: JSON.stringify(game.teamB),
		room: game.room,
		status: game.status,
		map: game.map,
		ip: game.ip,
		region: game.region,
		mmr_average: game.mmr_average,
	};

	await pool.query(
		`
		INSERT INTO 
			l4d2_queue_game 
		SET 
			?`,
		[insertObj],
	);
};

export const updateCurrentGame = async (gameid, userid) => {
	await pool.query(
		`
		UPDATE 
			users_web 
		SET
			game_id = ?
		WHERE
			WebID = ?`,
		[gameid, userid],
	);
};

export const getCurrentGamesActive = async (room) => {
	const response = await pool.query(
		`
		SELECT 
			teamA, 
			teamB, 
			status, 
			map, 
			ip,
			region,
			mmr_average,
			gamestarted 
		FROM
			l4d2_queue_game 
		WHERE
			status = 1 
		AND
			room = ?
		ORDER BY queueid DESC`,
		[room],
	);

	return response.map((row) => ({
		...row,
		teamA: JSON.parse(row.teamA),
		teamB: JSON.parse(row.teamB),
	}));
};
