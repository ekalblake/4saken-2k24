import { dropQueue, getQueuedUsers, insertNewgame, updateCurrentGame } from "../models/queueModel.js";

let queueArray = [];

const MMR_THRESHOLD = 500;

try {
	const response = await getQueuedUsers();

	queueArray = response;
} catch (err) {
	console.log(err);
}

export const queueEvents = (socket, io) => {
	socket.on("queue:join-queue", async ({ room, userInfo }) => {
		console.log(userInfo);

		let selectedRegions;
		if (userInfo.regions) {
			selectedRegions = userInfo.regions;
		} else {
			selectedRegions = ["NA"];
		}

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
		};

		queueArray.push(jugador);

		io.to(room).emit("queue:player-joined", jugador);

		const player = queueArray.find((p) => p.UserID === userInfo.UserID);

		const potentialMatches = findPotentialMatches(player);

		if (potentialMatches.length >= 8) {
			const bestRegion = findBestRegion(potentialMatches);

			const matchesInBestRegion = potentialMatches.filter((player) => player.regions.includes(bestRegion));

			if (matchesInBestRegion.length >= 8) {
				const sortedPlayers = matchesInBestRegion.sort((a, b) => b.joined_date - a.joined_date);

				const last8Players = sortedPlayers.slice(0, 8);

				//TODO: Borrar en la base de datos
				await startMatch(last8Players, io, room, bestRegion);
			} else {
				io.emit(
					"queue:waiting",
					`Not enough players in the best region (${bestRegion}). Currently found: ${matchesInBestRegion.length}`,
				);
			}
		} else {
			socket.emit("queue:waiting", `Waiting for more players. Currently found: ${potentialMatches.length}`);
		}
	});

	socket.on("queue:drop-queue", ({ userid, room }) => {
		const index = queueArray.findIndex((player) => player.UserID === userid);
		if (index !== -1) {
			queueArray.splice(index, 1);
		}

		io.to(room).emit("queue:player-dropped", userid);
		io.to(`user_${userid}`).emit("queue:player-dropped-single");
	});

	socket.on("queue:drop-party-member", (playerId) => {
		io.to(`user_${playerId}`).emit("queue:drop-party-member");
	});

	socket.on("disconnect", () => {
		removePlayerFromQueue(socket.id);
	});

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

	const removePlayerFromQueue = (socketId) => {
		queueArray = queueArray.filter((player) => player.socketId !== socketId);
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

	sortedPlayers.forEach((player) => {
		if (teamAMMR <= teamBMMR) {
			teamA.push(player);
			teamAMMR += player.Rating;
		} else {
			teamB.push(player);
			teamBMMR += player.Rating;
		}
	});

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
