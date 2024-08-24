import { QueueNameImages, QueueNames } from "../../constants/constants";
import helpers from "../../utils/Dateformat";
export default class PlayerItemModel {
	readonly UserID: number;
	readonly avatarfull: string;
	readonly colorChat: string;
	readonly glowColor: string;
	readonly Rating: number;
	readonly GamesPlayed: number;
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

	constructor(data: IPlayer) {
		this.UserID = data.UserID;
		this.avatarfull = data.avatarfull;
		this.colorChat = data.colorChat;
		this.glowColor = data.glowColor;
		this.Rating = data.Rating;
		this.GamesPlayed = data.GamesPlayed;
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
	public getRating(): number | string {
		return this.getGamesPlayed() < 8
			? "Sin calibrar"
			: Math.trunc(this.Rating);
	}
	public getGamesPlayed(): number {
		return this.GamesPlayed;
	}
	public getLastGame(): string {
		return "Fecha";
	}
	public getWins(): number {
		return this.Wins;
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

		const rating = this.getRating();

		let mmrImage = "";

		for (const [range, image] of Object.entries(ratingToMmrImageMap)) {
			if (rating >= range) {
				mmrImage = image;
			} else {
				break;
			}
		}

		return this.getGamesPlayed() < 8 ? "NO_RANKED.png" : mmrImage;
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

		const rating = this.getRating();

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
}
