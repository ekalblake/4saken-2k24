declare interface IQueueGames {
	gameid: matchid;
	ip: string;
	map: string;
	room: room;
	status: number;
	teamA: IPlayer[];
	teamB: IPlayer[];
	gamestarted: string | Date;
	region: string;
	mmr_average: number;
}
