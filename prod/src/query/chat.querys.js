import pool from "../database.js";
import { sqlResponse } from "../utils/errors.js";

export const getMessageList = async (room) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT 
				chat_room.chatid,
				chat_room.message_body,
				chat_room.room,
				chat_room.created_at,
				users_web.avatarfull,
				users_web.personaname,
				users_web.profileurl,
				users_web.colorChat,
				users_web.glowColor,
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
				chatid DESC`,
			[room],
			(err, results) => {
				if (err) {
					return reject(sqlResponse(err));
				}
				resolve(results);
			},
		);
	});
};

export const sendMessage = async (message) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`INSERT INTO 
				chat_room (userid, message_body, room)
             VALUES 
			 	(?,?,?)`,
			[message.userid, message.message_body, message.room],
			(err, results) => {
				if (err) {
					return reject(sqlResponse(err));
				}
				resolve(results);
			},
		);
	});
};
