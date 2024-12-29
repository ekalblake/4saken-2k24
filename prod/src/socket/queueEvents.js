import {
	dropQueue,
	getQueuedUsers,
	getUserInformationGroup,
	insertNewgame,
	updateCurrentGame,
} from "../models/queueModel.js";

let queueArray = [];

const MMR_THRESHOLD = 500;

getQueuedUsers().then((response) => {
	queueArray = response;
});

export const queueEvents = (socket, io, userInfo) => {
	socket.on("queue:join-queue", async ({ room, userInfo }) => {
		const selectedRegions = userInfo.regions || ["NA"];

		const jugador = {
			UserID: userInfo.UserID,
			SteamID64: userInfo.SteamID64,
			room: userInfo.room,
			joined_date: userInfo.joined_date,
			avatarfull: userInfo.avatarfull,
			personaname: userInfo.personaname,
			profileurl: userInfo.profileurl,
			regions: selectedRegions,
			Rol: userInfo.Rol,
			IsPremium: userInfo.isPremium,
			colorChat: userInfo.colorChat,
			glowColor: userInfo.glowColor,
			Rating: userInfo.Rating,
			GamesPlayed: userInfo.GamesPlayed,
			LastGame: userInfo.LastGame,
			Wins: userInfo.Wins,
			socketId: socket.id,
			party_id: userInfo.party_id,
		};

		queueArray.push(jugador);

		io.to(room).emit("queue:player-joined", jugador);

		/* const player = queueArray.find((p) => p.UserID === userInfo.UserID);

		const potentialMatches = findPotentialMatches(player);

		if (potentialMatches.length >= 8) {
			const bestRegion = findBestRegion(potentialMatches);

			const matchesInBestRegion = potentialMatches.filter((player) => player.regions.includes(bestRegion));

			if (matchesInBestRegion.length >= 8) {
				const sortedPlayers = matchesInBestRegion.sort((a, b) => b.joined_date - a.joined_date);

				const last8Players = sortedPlayers.slice(0, 8);

				await startMatch(last8Players, io, room, bestRegion);
			} else {
				io.emit(
					"queue:waiting",
					`Not enough players in the best region (${bestRegion}). Currently found: ${matchesInBestRegion.length}`,
				);
			}
		} else {
			socket.emit("queue:waiting", `Waiting for more players. Currently found: ${potentialMatches.length}`);
		} */
	});

	socket.on("queue:party-join-queue", async ({ room, members_id }) => {
		const partyMembers = await getUserInformationGroup(members_id);

		partyMembers.forEach((member) => {
			const selectedRegions = member.regions || ["NA"];

			const jugadorInQueue = {
				UserID: member.UserID,
				SteamID64: member.SteamID64,
				room: member.room,
				joined_date: member.joined_date,
				avatarfull: member.avatarfull,
				personaname: member.personaname,
				profileurl: member.profileurl,
				regions: selectedRegions,
				Rol: member.Rol,
				IsPremium: member.isPremium,
				colorChat: member.colorChat,
				glowColor: member.glowColor,
				Rating: member.Rating,
				GamesPlayed: member.GamesPlayed,
				LastGame: member.LastGame,
				Wins: member.Wins,
				socketId: socket.id,
				party_id: member.party_id,
			};

			queueArray.push(jugadorInQueue);

			io.to(room).emit("queue:player-joined", jugadorInQueue);
			io.to(`user_${member.UserID}`).emit("queue:party-join-single");
		});
	});

	socket.on("queue:drop-queue", ({ userid, room }) => {
		const index = queueArray.findIndex((player) => player.UserID === userid);
		if (index !== -1) {
			queueArray.splice(index, 1);
		}

		io.to(room).emit("queue:player-dropped", userid);
		io.to(`user_${userid}`).emit("queue:player-dropped-single");
	});

	socket.on("queue:party-drop-queue", ({ room, members_id }) => {
		members_id.forEach((id) => {
			const index = queueArray.findIndex((player) => player.UserID === id);
			if (index !== -1) {
				queueArray.splice(index, 1);
			}
			io.to(room).emit("queue:player-dropped", id);
			io.to(`user_${id}`).emit("queue:player-dropped-single");
		});
	});

	socket.on("queue:drop-party-member", (playerId) => {
		io.to(`user_${playerId}`).emit("queue:drop-party-member");
	});

	socket.on("disconnect", async () => {
		const index = queueArray.findIndex((player) => player.UserID === userInfo.UserID);
		if (index !== -1) {
			queueArray.splice(index, 1);
		}

		io.emit("queue:player-dropped", userInfo.UserID);

		await dropQueue(userInfo.UserID);
	});

	setInterval(() => {
		queueArray.forEach(async (player) => {
			const potentialMatches = findPotentialMatches(player);

			if (potentialMatches.length >= 8) {
				const bestRegion = findBestRegion(potentialMatches);

				const matchesInBestRegion = potentialMatches.filter((player) => player.regions.includes(bestRegion));

				if (matchesInBestRegion.length >= 8) {
					const sortedPlayers = matchesInBestRegion.sort((a, b) => b.joined_date - a.joined_date);
					const last8Players = sortedPlayers.slice(0, 8);

					await startMatch(last8Players, io, player.room, bestRegion);
				}
			}
		});
	}, 60000);

	const startMatch = async (players, io, room, region) => {
		try {
			const gameid = generateMatchId();

			const teams = assignTeamsByMMR(players);

			const totalMMR = players.reduce((sum, player) => sum + player.Rating, 0);
			const mmr_average = Math.round(totalMMR / players.length);

			const objReturn = {
				gameid: gameid,
				teamA: teams.teamA,
				teamB: teams.teamB,
				ip: "192.168.1.1",
				map: "The Parish",
				gamestarted: new Date(),
				room,
				status: 1,
				region,
				mmr_average,
			};

			players.forEach((player) => {
				const index = queueArray.findIndex((p) => p.UserID === player.UserID);
				if (index !== -1) queueArray.splice(index, 1);

				updateCurrentGame(gameid, player.UserID);

				dropQueue(player.UserID);

				io.to(`user_${player.UserID}`).emit("queue:player-dropped-single");
				io.to(`user_${player.UserID}`).emit("queue:match-start", objReturn);
				io.to(room).emit("queue:player-dropped", player.UserID);
			});

			await insertNewgame(objReturn);

			console.log(`Match started with players: ${players.map((p) => p.personaname).join(", ")}`);
		} catch (err) {
			console.log(err);
		}
	};
};

const generateMatchId = () => {
	const timestamp = Math.floor(Date.now() / 1000);
	const randomNum = Math.floor(Math.random() * 10000);
	return `L4D2MATCH-${timestamp}-${randomNum}`;
};

const findPotentialMatches = (player) => {
	const { regions, Rating } = player;

	const potentialMatches = queueArray.filter((otherPlayer) => {
		const hasCommonRegion = otherPlayer.regions.some((region) => regions.includes(region));

		const isMMRSimilar = Math.abs(otherPlayer.Rating - Rating) <= MMR_THRESHOLD;

		return hasCommonRegion && isMMRSimilar;
	});
	return potentialMatches;
};
const assignTeamsByMMR = (players) => {
	const sortedPlayers = players.sort((a, b) => b.Rating - a.Rating);

	let teamA = [];
	let teamB = [];
	let teamAMMR = 0;
	let teamBMMR = 0;

	const partyGroups = new Map();

	for (const player of sortedPlayers) {
		if (player.party_id) {
			if (!partyGroups.has(player.party_id)) {
				partyGroups.set(player.party_id, []);
			}
			partyGroups.get(player.party_id).push(player);
		} else {
			partyGroups.set(player.UserID, [player]);
		}
	}

	const groups = Array.from(partyGroups.values());

	for (const group of groups) {
		const groupMMR = group.reduce((sum, p) => sum + p.Rating, 0);

		if ((teamA.length + group.length <= 4 && teamAMMR <= teamBMMR) || teamB.length + group.length > 4) {
			teamA.push(...group);
			teamAMMR += groupMMR;
		} else if (teamB.length + group.length <= 4) {
			teamB.push(...group);
			teamBMMR += groupMMR;
		}
	}

	return { teamA, teamB };
};

const findBestRegion = (players) => {
	const regionCounts = {};

	players.forEach((player) => {
		player.regions.forEach((region) => {
			if (!regionCounts[region]) {
				regionCounts[region] = 0;
			}
			regionCounts[region]++;
		});
	});

	const bestRegion = Object.keys(regionCounts).reduce((a, b) => (regionCounts[a] > regionCounts[b] ? a : b));

	return bestRegion;
};
