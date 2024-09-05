import helpers from "../utils/helpers";
const { v4: uuidv4 } = require("uuid");

/************************************************************************************************************
 * Queue Events
 ***********************************************************************************************************/

let queueArray = [];
let readyArray = [];
let ongoingMatches = [];

const TEAM_SIZE = 1;
const MMR_VARIATION = 500;

export const queueEvents = (socket, io) => {
	socket.on("queue:join-queue", ({ room, userInfo }) => {
		io.to(room).emit("queue:player-joined");

		queueArray.push({
			socketId: socket.id,
			userInfo,
			joinedAt: Date.now(),
		});

		checkQueueAndPromptReady();
	});

	socket.on("queue:drop-queue", ({ userid, room }) => {
		io.to(room).emit("queue:player-dropped");

		const index = queueArray.findIndex((player) => player.UserID === userid);
		if (index !== -1) {
			queueArray.splice(index, 1);
		}
	});

	socket.on("queue:verify-queue-player", (players) => {
		queueArray.push(players);
	});

	socket.on("queue:set-ready", () => {
		console.log("set ready");
		setPlayerReady(socket.id);
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

	socket.on("disconnect", () => {
		removePlayerFromQueue(socket.id);
		handlePlayerDisconnect(socket.id);
	});

	const checkQueueAndPromptReady = () => {
		if (queueArray.length >= TEAM_SIZE * 2) {
			const potentialMatch = queueArray.slice(0, TEAM_SIZE * 2);

			potentialMatch.forEach((player) => {
				io.to(player.socketId).emit("queue:prompt-ready");
			});

			readyArray = potentialMatch;

			queueArray = queueArray.slice(TEAM_SIZE * 2);
		}
	};

	const setPlayerReady = (socketId) => {
		const player = readyArray.find((player) => player.socketId === socketId);
		console.log(player);
		if (player) {
			player.userInfo.isJoined = 2;

			if (readyArray.every((player) => player.userInfo.isJoined)) {
				const matchGroup = formMatchGroup(readyArray);

				if (matchGroup) {
					startMatch(matchGroup.team1, matchGroup.team2);
					readyArray = [];
				}
			}
		}
	};

	const formMatchGroup = (readyPlayers) => {
		readyPlayers.sort((a, b) => a.userInfo.Rating - b.userInfo.Rating);

		let team1 = [];
		let team2 = [];

		for (let i = 0; i < readyPlayers.length; i++) {
			if (team1.length < TEAM_SIZE && canJoinTeam(team1, readyPlayers[i].userInfo.Rating)) {
				team1.push(readyPlayers[i]);
			} else if (team2.length < TEAM_SIZE && canJoinTeam(team2, readyPlayers[i].userInfo.Rating)) {
				team2.push(readyPlayers[i]);
			}

			if (team1.length === TEAM_SIZE && team2.length === TEAM_SIZE) {
				return { team1, team2 };
			}
		}

		// Si no se pueden formar equipos, los jugadores vuelven a la cola
		queueArray.push(...readyPlayers);
		readyArray = [];
		return null;
	};

	const canJoinTeam = (team, mmr) => {
		if (team.length === 0) return true;
		const minMMR = Math.min(...team.map((player) => player.userInfo.mmr));
		const maxMMR = Math.max(...team.map((player) => player.userInfo.mmr));
		return mmr >= minMMR - MMR_VARIATION && mmr <= maxMMR + MMR_VARIATION;
	};

	const startMatch = (team1, team2) => {
		const matchId = generateMatchId();
		ongoingMatches.push({
			matchId,
			teams: { team1, team2 },
			startTime: Date.now(),
		});

		[...team1, ...team2].forEach((player) => {
			io.to(player.socketId).emit("match:start", {
				matchId,
				team: team1.includes(player) ? "team1" : "team2",
				opponents: team1.includes(player) ? team2.map((p) => p.userInfo) : team1.map((p) => p.playerInfo),
			});
		});
	};

	const removePlayerFromQueue = (socketId) => {
		queueArray = queueArray.filter((player) => player.socketId !== socketId);
	};

	const handlePlayerDisconnect = (socketId) => {
		let playerIndex = readyArray.findIndex((player) => player.socketId === socketId);

		if (playerIndex !== -1) {
			const disconnectedPlayer = readyArray[playerIndex];
			readyArray.splice(playerIndex, 1);

			// Regresar a la cola a todos los jugadores que estaban esperando para formar equipos
			queueArray.push(...readyArray);
			readyArray = [];

			io.to(disconnectedPlayer.socketId).emit("queue:player-disconnected");
			checkQueueAndPromptReady(); // Verificar si hay suficientes jugadores para reintentar el emparejamiento
		} else {
			// El jugador estaba en la cola normal
			removePlayerFromQueue(socketId);
		}
	};
};

const generateMatchId = () => {
	return `L4D2MATCH-${uuidv4()}`;
};
