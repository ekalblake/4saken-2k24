import { HTTP_STATUS } from "../config";
import { dropQueue, verifyQueue, joinQueue } from "../query/queue.query";
import { responseError } from "../utils/errors";

import helpers from "../utils/helpers";
/************************************************************************************************************
 * Queue Events
 ***********************************************************************************************************/

const queueArray = [];

const playingList = [];

export const queueEvents = (socket, io, userInfo) => {
	socket.on("queue:join-queue", async ({ room }) => {
		joinQueue(room, userInfo)
			.then((response) => {
				io.to(room).emit("queue:player-joined");
				io.to(`user_${userInfo.UserID}`).emit("queue:player-joined-user");

				queueArray.push(response);
			})
			.catch((err) => {
				console.log(err);
				io.to(`user_${userInfo.UserID}`).emit(
					"event:error-found",
					responseError(HTTP_STATUS.BAD_REQUEST, null, err.message),
				);
			});
	});

	socket.on("queue:drop-queue", async ({ userid, room }) => {
		dropQueue(userid)
			.then(() => {
				console.log(room);
				io.to(room).emit("queue:player-dropped");
				io.to(`user_${userid}`).emit("queue:player-dropped-user");

				const index = queueArray.findIndex((player) => player.UserID === userid);
				if (index !== -1) {
					queueArray.splice(index, 1);
				}
			})
			.catch((err) => {
				console.log(err);
				io.to(`user_${userid}`).emit(
					"event:error-found",
					responseError(HTTP_STATUS.BAD_REQUEST, err, "No has podido salir de la cola"),
				);
			});
	});

	//After 8 players accept queue
	socket.on("accept:game", async ({ userid, room }) => {
		queryUpdatePlayer(userid);

		const getInfoUser = await pool.query(`SELECT * FROM l4d2_queue where userid = ?`, [userid]);

		if (getInfoUser.length == 0) return;

		io.to(room).emit("accept:game", userid, getInfoUser[0].region);

		//Verifica que hayan 8 para poder empezar la partida.
		let queryVerify = await pool.query(`CALL playerAcceptMatchInformation(?)`, [getInfoUser[0].region]);

		//Longitud
		if (queryVerify[0].length == 8) {
			//isJoined ( ready ) = 2
			await pool.query(
				"DELETE FROM `4saken`.l4d2_queue WHERE isjoined = 2 and region = ?",
				getInfoUser[0].region,
			);

			//Votar a los 8 de la region
			io.to(room).emit("drop:players", getInfoUser[0].region);

			let getIP = await getRandomIP();

			let finishedTeam = await helpers.getTeams(queryVerify[0], getIP);

			/* let unixTimestamp = Math.floor(Date.now() / 1000);

                    const newMessage = {
                         'userid': 12,
                         'message_body': JSON.stringify(finishedTeam),
                         'room': room,
                         'created_at': unixTimestamp
                    }
                    console.log(newMessage);
                    let gameStarted = await pool.query('INSERT INTO chat_room SET ?', [newMessage]) */

			/* let selectMessage = await pool.query(`SELECT chat_room.chatid,
                                                                      chat_room.message_body,
                                                                      chat_room.room,
                                                                      chat_room.created_at,
                                                                      users_general.UserID
                                                            FROM 4saken.chat_room
                                                                      INNER JOIN 4saken.users_general
                                                                                ON chat_room.userid = users_general.userid
                                                            WHERE chat_room.userid = ?
                                                                 and chat_room.message_body = ?`, [newMessage.userid, newMessage.message_body]) */

			//Emitir mensaje global
			/* io.to(room).emit('message:chat', newMessage) */
			/* 'teamA': '[' + JSON.stringify(finishedTeam['teamA'][0]) + ',' + JSON.stringify(finishedTeam['teamA'][1]) + ',' + JSON.stringify(finishedTeam['teamA'][2]) + ',' + JSON.stringify(finishedTeam['teamA'][3]) + ']',
                         'teamB': '[' + JSON.stringify(finishedTeam['teamB'][0]) + ',' + JSON.stringify(finishedTeam['teamB'][1]) + ',' + JSON.stringify(finishedTeam['teamB'][2]) + ',' + JSON.stringify(finishedTeam['teamB'][3]) + ']',
                          */
			const newLobby = {
				teamA:
					"[" +
					JSON.stringify(finishedTeam["teamA"][0]) +
					"," +
					JSON.stringify(finishedTeam["teamA"][1]) +
					"," +
					JSON.stringify(finishedTeam["teamA"][2]) +
					"," +
					JSON.stringify(finishedTeam["teamA"][3]) +
					"]",
				teamB:
					"[" +
					JSON.stringify(finishedTeam["teamB"][0]) +
					"," +
					JSON.stringify(finishedTeam["teamB"][1]) +
					"," +
					JSON.stringify(finishedTeam["teamB"][2]) +
					"," +
					JSON.stringify(finishedTeam["teamB"][3]) +
					"]",
				region: getInfoUser[0].region,
				map: finishedTeam.map,
				ip: finishedTeam.ip,
			};
			await pool.query("INSERT INTO `4saken`.l4d2_queue_game SET ?", [newLobby]);

			io.emit("current:games", newLobby);
		}
	});

	socket.on("room:new-game", async () => {
		//Verifica que existan 8 en la región
		let queryVerify = await queryPlayersVerify(region);

		//Longitud
		if (queryVerify.length != 8) return;

		let timerId = setInterval(countdown, 1000);

		let verifyAfter = await queryPlayersVerifyCounter(region);

		async function countdown() {
			//Longitud
			/* if (timeRemaining == 1 || verifyAfter.length != 8) {
				clearTimeout(timerId);
				timeRemaining = 30;

				//Longitud
				if (verifyAfter.length == 8) {
					io.to(room).emit("player:left", userInfo.UserID);
					let verifyUnready = await queryVerifyUnreadyPlayers(region);
					console.log(verifyUnready);
					verifyUnready.map(async (player) => {
						let dropQueue = queryDropPlayerQueue(player.userid);
						if (dropQueue) {
							try {
								//Actualizar estado de todos a 1
								await queryUpdatePlayerStatus(player.region);

								io.to(room).emit("drop:queue", player.userid, player.region);
							} catch (err) {
								console.log(err);
							}
						}
					});
				} else {
					io.to(room).emit("player:left", userInfo.UserID);
					console.log("Se fue uno");
				}
			} else {
				verifyAfter = await queryPlayersVerifyCounter(region);
				timeRemaining--;
				console.log(timeRemaining);
			} */
		}
	});

	setInterval(async () => {
		verifyQueue().then((playerList) => {
			if (playerList.length == 0) {
				return;
			}

			playerList.forEach((player) => {
				let playerDate = Math.floor(Date.now(player.join_date) / 1000);
				if (helpers.currentDate() - playerDate > 1800) {
					dropQueue(player.userid)
						.then(() => {
							io.to(player.region).emit("queue:player-dropped");
							io.to(`user_${player.userid}`).emit("queue:player-dropped-user");
						})
						.catch((err) => {
							console.log(err);
							io.to(`user_${player.userid}`).emit(
								"event:error-found",
								responseError(HTTP_STATUS.BAD_REQUEST, err, "No has podido salir de la cola"),
							);
						});
				}
			});
		});
	}, 5000);
};

const verifyQueue = () => {
	const verifyInterval = setInterval(async () => {
		if (queueArray.length == 2) {
			clearInterval(verifyInterval);

			queueArray.forEach((player) => {
				io.to(`user_${player.UserID}`).emit("queue:set-player-ready");
			});
		}
	}, 50000);
};
