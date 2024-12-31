import helpers from "@/utils/Dateformat";
import { MatchFoundImages, QueueNameImages } from "@/constants/constants";
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

	constructor(data: IQueueGame) {
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

	public getMapImage(): string {
		const mapList: any = {
			c1m1_hotel: "DeadCenter.jpg",
			c2m1_highway: "DarkCarnival.png",
			c3m1_plankcountry: "SwapmFever.jpg",
			c4m1_milltown_a: "HardRain.jpg",
			c5m1_waterfront: "TheParish.jpg",
			c6m1_riverbank: "DefaultL4D2.png",
			c8m1_apartment: "NoMercy.jpg",
			c10m1_caves: "DeathToll.jpg",
			c11m1_greenhouse: "DeadAir.jpg",
			c12m1_hilltop: "BloodHarvest.jpg",
			c13m1_alpinecreek: "ColdStream.png",
		};

		return mapList[this.map] || "DefaultL4D2.png";
	}

	public getMapName(): string {
		const mapList: any = {
			c1m1_hotel: "Dead Center",
			c2m1_highway: "Dark Carnival",
			c3m1_plankcountry: "Swapm Fever",
			c4m1_milltown_a: "Hard Rain",
			c5m1_waterfront: "The Parish",
			c6m1_riverbank: "The Passing",
			c8m1_apartment: "No Mercy",
			c10m1_caves: "Death Toll",
			c11m1_greenhouse: "Dead Air",
			c12m1_hilltop: "Blood Harvest",
			c13m1_alpinecreek: "Cold Stream",
		};

		return mapList[this.map] || "Desconocido";
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
			3000: MatchFoundImages.FOUND_ADEPT,
			5000: MatchFoundImages.FOUND_VETERAN,
		};

		if (this.mmr_average <= 3000) {
			return mmrQueue[0];
		} else if (this.mmr_average <= 5000) {
			return mmrQueue[3000];
		} else {
			return mmrQueue[5000];
		}
	}

	public getRankImage(): string {
		const mmrQueue: any = {
			0: QueueNameImages.QUEUE_SCOUT_LOGO,
			3000: QueueNameImages.QUEUE_ADEPT_LOGO,
			5000: QueueNameImages.QUEUE_VETERAN_LOGO,
		};

		if (this.mmr_average <= 3000) {
			return mmrQueue[0];
		} else if (this.mmr_average <= 5000) {
			return mmrQueue[3000];
		} else {
			return mmrQueue[5000];
		}
	}

	public getMmrAverage(): number {
		return this.mmr_average;
	}
}
