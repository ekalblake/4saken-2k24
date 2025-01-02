import pool from "../database.js";

export const getMessageList = async (room) => {
	const chatList = await pool.query(
		`
		SELECT 
			chat_room.chatid,
			chat_room.message_body,
			chat_room.message_data,
			chat_room.message_type,
			chat_room.parentid,
			chat_room.room,
			chat_room.created_at,
			users_web.avatarfull,
			users_web.personaname,
			users_web.profileurl,
			users_web.colorChat,
			users_web.glowColor,
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
			users_general
		INNER JOIN 
			chat_room ON users_general.UserID = chat_room.userid
		INNER JOIN 
			users_web ON users_general.UserID = users_web.WebID
		INNER JOIN 
			users_mmr ON users_general.UserID = users_mmr.Pug_MMRID
		INNER JOIN 
			duel_mmr ON users_general.UserID = duel_mmr.Duel_MMRID
		INNER JOIN 
			users_permisions ON users_general.UserID = users_permisions.PermisionsID
		WHERE 
			room = ?
		ORDER BY 
			chatid DESC 
		LIMIT
			50`,
		[room],
	);
	return chatList;
};

export const addMessage = async (userid, message_type, message_data, room, unixTimestamp) => {
	const newMessage = await pool.query(
		`
			INSERT INTO 
				chat_room (userid, message_type, message_data, room, created_at)
			VALUES (?, ?, ?, ?, ?)`,
		[userid, message_type, message_data, room, unixTimestamp],
	);

	const [getMessage] = await pool.query(
		`
		SELECT
			users_general.UserID,
			users_general.SteamID64,
			chat_room.chatid, 
			chat_room.message_body,
			chat_room.message_type,
			chat_room.message_data,
			chat_room.parentid,
			chat_room.created_at,
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
		FROM 
			users_general
		INNER JOIN 
			chat_room
		ON 
			users_general.UserID = chat_room.userid
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
			chat_room.chatid = ?
		LIMIT 1`,
		[newMessage.insertId],
	);

	return getMessage;
};
