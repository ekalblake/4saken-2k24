export enum WebPages {
	HOME = "Home",
	ABOUT = "About",
	FAQ = "FAQ",
	LEADERBOARD = "Leaderboard",
	PARTNERS = "Partners",
	TEAMS = "Teams",
	PREMIUM = "Prime",
	RANKED = "Ranked",
	SOLO = "Solo",
	NOTFOUND = "NotFound",
	CONFIGURATION = "Configuration",
	SERVERS = "Servers",
	ADMIN = "Admin",
	ADMIN_PLAYERS = "Admin_Players",
	ADMIN_SERVERS = "Admin_Servers",
	ADMIN_MAPS = "Admin_Maps",
}
export enum QueueNames {
	SCOUT_1 = "Scout 1",
	SCOUT_2 = "Scout 2",
	SCOUT_3 = "Scout 3",
	ADEPT_1 = "Adept 1",
	ADEPT_2 = "Adept 2",
	ADEPT_3 = "Adept 3",
	VETERAN_1 = "Veteran 1",
	VETERAN_2 = "Veteran 2",
	VETERAN_3 = "Veteran 3",
	FORSAKEN = "Forsaken",
}
export enum QueueNameImages {
	SCOUT_1 = "SCOUT_1.png",
	SCOUT_2 = "SCOUT_2.png",
	SCOUT_3 = "SCOUT_3.png",
	ADEPT_1 = "ADEPT_1.png",
	ADEPT_2 = "ADEPT_2.png",
	ADEPT_3 = "ADEPT_3.png",
	VETERAN_1 = "VETERAN_1.png",
	VETERAN_2 = "VETERAN_2.png",
	VETERAN_3 = "VETERAN_3.png",
	FORSAKEN = "4SAKEN.png",
	QUEUE_SCOUT_LOGO = "SCOUT_LOGO.png",
	QUEUE_ADEPT_LOGO = "ADEPT_LOGO.png",
	QUEUE_VETERAN_LOGO = "VETERAN_LOGO.png",
}

export enum MatchFoundImages {
	FOUND_ADEPT = "MATCH_ADEPT.png",
	FOUND_SCOUT = "MATCH_SCOUT.png",
	FOUND_VETERAN = "MATCH_VETERAN.png",
}

export enum Variables {
	FORSAKEN = "4SAKEN SUPPORT",
}

/**
 * TODO: VOLVER VARIABLES DE ENTORNO
 */

// API URL

export const API_URL =
	process.env.NODE_ENV === "production" ? "https://forsaken-blk.herokuapp.com" : "http://localhost:5001";
export const CLIENT_URL = process.env.NODE_ENV === "production" ? "https://4saken.us" : "http://localhost:8080";

//export const GATEWAY_URL

//export const API_URL = 'https://forsaken-blk.herokuapp.com';
//export const CLIENT_URL = 'https://4saken.us';

export const STEAM_API_KEY = "F4B7214EE1F02F559B1EA7F1BE7D28CB";

/*
STEAM API
GAME INFO
https://developer.valvesoftware.com/wiki/Steam_Web_API#GetNewsForApp_.28v0001.29

STEAM USER STATS:
https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29

STEAM USERS:


 */
