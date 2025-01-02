import { QueueNameImages, QueueNames } from "../../constants/constants";
import helpers from "../../utils/Dateformat";
export default class PlayerItemModel {
	readonly UserID: number;
	readonly avatarfull: string;
	private colorChat: string;
	private glowColor: string;
	readonly Rating: number;
	readonly RatingDuel: number;
	readonly GamesPlayed: number;
	readonly GamesPlayedDuel: number;
	readonly LastGame: string;
	readonly Wins: number;
	readonly personaname: string;
	readonly personastate: number;
	readonly profileurl: string;
	readonly timecreated: string;
	readonly Rol: number;
	readonly SteamID64: number;
	readonly IsPremium: number;
	readonly created_at: string;
	readonly regions: string[];

	constructor(data: IPlayer) {
		this.UserID = data.UserID;
		this.avatarfull = data.avatarfull;
		this.colorChat = data.colorChat;
		this.glowColor = data.glowColor;
		this.Rating = data.Rating;
		this.RatingDuel = data.RatingDuel;
		this.GamesPlayed = data.GamesPlayed;
		this.GamesPlayedDuel = data.GamesPlayedDuel;
		this.LastGame = data.LastGame;
		this.Wins = data.Wins;
		this.personaname = data.personaname;
		this.personastate = data.personastate;
		this.profileurl = data.profileurl;
		this.timecreated = data.timecreated;
		this.Rol = data.Rol;
		this.SteamID64 = data.SteamID64;
		this.IsPremium = data.IsPremium;
		this.created_at = data.created_at;
		this.regions = data.regions;
	}

	public getUserId(): number {
		return this.UserID;
	}

	public getAvatarFull(): string {
		return this.avatarfull;
	}

	public getColorChat(): string {
		return this.colorChat;
	}

	public getGlowColor(): string {
		return this.glowColor;
	}

	public getColorChatStyle(): Record<string, string> {
		return {
			color: this.colorChat,
			"text-shadow": "0 0 10px " + this.glowColor,
		};
	}

	public getIsSupportStyle(): Record<string, string> {
		return {
			color: "navy",
			textShadow: "rgb(255 0 0) 0px 0px 10px",
			fontWeight: "bold",
		};
	}

	public getColorStyle(): string {
		return `box-shadow: 0px 0px 5px ${this.colorChat};`;
	}

	public getBackgroundColor(): Record<string, string> {
		return {
			"box-shadow": `0px 0px 5px ${this.glowColor} !important`,
		};
	}

	public getBoxShadow(): Record<string, string> {
		return {
			"box-shadow": `0px 0px 5px ${this.glowColor} !important`,
		};
	}

	public getBackgroundBox(): Record<string, string> {
		return {
			"background-color": `0px 0px 10px ${this.glowColor} !important`,
		};
	}

	public getBackground(): Record<string, string> {
		return {
			background: `${this.glowColor} !important`,
		};
	}
	public getRating(): number | string {
		if (this.getGamesPlayed() < 8) {
			return "SIN CALIBRAR";
		}
		return Math.trunc(this.Rating);
	}

	public getRatingDuel(): number | string {
		if (this.GamesPlayedDuel < 8) {
			return "SIN CALIBRAR";
		}
		return Math.trunc(this.RatingDuel);
	}

	public getGamesPlayed(): number {
		return this.GamesPlayed;
	}

	public getGamesPlayedDuel(): number {
		return this.GamesPlayedDuel;
	}

	public getLastGame(): string {
		return "Fecha";
	}

	public getWins(): number {
		return this.Wins;
	}

	public getRegions(): string[] {
		return this.regions;
	}

	public getMmrImage(): string {
		const ratingToMmrImageMap = {
			0: QueueNameImages.SCOUT_1,
			500: QueueNameImages.SCOUT_2,
			1000: QueueNameImages.SCOUT_3,
			1500: QueueNameImages.ADEPT_1,
			2000: QueueNameImages.ADEPT_2,
			2500: QueueNameImages.ADEPT_3,
			3000: QueueNameImages.VETERAN_1,
			3500: QueueNameImages.VETERAN_2,
			4000: QueueNameImages.VETERAN_3,
			4500: QueueNameImages.FORSAKEN,
		};

		const rating: any = this.getRating();

		let mmrImage = "";

		for (const [range, image] of Object.entries(ratingToMmrImageMap)) {
			if (rating >= range) {
				mmrImage = image;
			} else {
				break;
			}
		}

		return this.getGamesPlayed() < 8 ? "/assets/ranked_medals/NO_RANKED.png" : `/assets/ranked_medals/${mmrImage}`;
	}

	public getMmrName(): string {
		const ratingToMmrImageMap = {
			0: QueueNames.SCOUT_1,
			500: QueueNames.SCOUT_2,
			1000: QueueNames.SCOUT_3,
			1500: QueueNames.ADEPT_1,
			2000: QueueNames.ADEPT_2,
			2500: QueueNames.ADEPT_3,
			3000: QueueNames.VETERAN_1,
			3500: QueueNames.VETERAN_2,
			4000: QueueNames.VETERAN_3,
			4500: QueueNames.FORSAKEN,
		};

		const rating: any = this.getRating();

		let mmrImage = "";

		for (const [range, image] of Object.entries(ratingToMmrImageMap)) {
			if (rating >= range) {
				mmrImage = image;
			} else {
				break;
			}
		}

		return this.getGamesPlayed() < 8 ? "SIN CALIBRAR" : mmrImage;
	}
	public getPersonaName(): string {
		return this.personaname;
	}
	public getProfileURL(): string {
		return this.profileurl;
	}
	public getCurrentStatus(): number {
		return this.personastate;
	}
	public getRol(): number {
		return this.Rol;
	}
	public getSteamId(): number {
		return this.SteamID64;
	}
	public getTimeCreated(): string {
		return this.timecreated;
	}
	public getIsPremium(): number {
		return this.IsPremium;
	}
	public getIsSupporting(): boolean {
		return this.personaname.includes("#4saken") ? true : false;
	}
	public getCreatedAt(): string {
		return helpers.dateToFamily(this.created_at);
	}

	public setChatColor(color: string | undefined) {
		if (!color) return;
		this.colorChat = color;
	}

	public setGlowColor(color: string | undefined) {
		if (!color) return;
		this.glowColor = color;
	}
}
