import helpers from "@/utils/Dateformat";
import { MatchFoundImages } from "@/constants/constants";
import PlayersModel from "../Player/PlayersModel";

export default class QueueGamesItemModel {
	private gameid: string;
	private ip: string;
	private map: string;
	private room: number;
	private status: number;
	private teamA: IPlayer[];
	private teamB: IPlayer[];
	private gamestarted: string | Date;
	private region: string;
	private mmr_average: number;

	constructor(data: IQueueGames) {
		this.gameid = data.gameid;
		this.ip = data.ip;
		this.map = data.map;
		this.room = data.room;
		this.status = data.status;
		this.teamA = data.teamA;
		this.teamB = data.teamB;
		this.gamestarted = data.gamestarted;
		this.region = data.region;
		this.mmr_average = data.mmr_average;
	}

	public getMatchId(): string {
		return this.gameid;
	}

	public getGameStarted(): string | Date {
		return helpers.timeago(this.gamestarted);
	}
	public getIp(): string {
		return this.ip;
	}
	public getMap(): string {
		return this.map;
	}
	public getRoom(): number {
		return this.room;
	}
	public getStatus(): number {
		return this.status;
	}
	public getTeamA(): PlayersModel {
		return new PlayersModel(this.teamA);
	}
	public getTeamB(): PlayersModel {
		return new PlayersModel(this.teamB);
	}

	public getRegion(): string {
		return this.region;
	}

	public getCurrentRoom(): string {
		const rankedQueue: any = {
			1: "UNRANKED",
			2: "RANKED",
			3: "SOLO",
			4: "DUO",
			5: "SCRIMS",
		};
		return rankedQueue[this.room] || "1";
	}

	public getMmrImage(): string {
		const mmrQueue: any = {
			0: MatchFoundImages.FOUND_SCOUT,
			1250: MatchFoundImages.FOUND_ADEPT,
			2250: MatchFoundImages.FOUND_VETERAN,
		};

		if (this.mmr_average <= 1250) {
			return mmrQueue[0];
		} else if (this.mmr_average <= 2250) {
			return mmrQueue[1250];
		} else {
			return mmrQueue[2250];
		}
	}

	public getMmrAverage(): number {
		return this.mmr_average;
	}
}
