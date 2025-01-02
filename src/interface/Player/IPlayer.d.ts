declare interface IPlayer {
	UserID: number;
	avatarfull: string;
	colorChat: string;
	glowColor: string;
	Rating: number;
	RatingDuel: number;
	GamesPlayed: number;
	GamesPlayedDuel: number;
	LastGame: string;
	Wins: number;
	personaname: string;
	personastate: number;
	profileurl: string;
	timecreated: string;
	Rol: number;
	SteamID64: number;
	IsPremium: number;
	created_at: string;
	regions: string[];

	/* success?: boolean;
	HTTP_STATUS?: number;
	msg?: string; */
}
