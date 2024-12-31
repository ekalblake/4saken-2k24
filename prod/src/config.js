import { config } from "dotenv";

config();

export const BD_HOST = process.env.BD_HOST;
export const BD_PORT = process.env.BD_PORT;
export const BD_USER = process.env.BD_USER;
export const BD_PASSWORD = process.env.BD_PASSWORD;
export const BD_NAME = process.env.BD_NAME;

export const DB_NAME = process.env.DB_NAME;
export const PORT = process.env.PORT || 5001;

export const CLIENT_URL = process.env.CLIENT_URL;
export const API_URL = process.env.API_URL;

export const STEAM_API = process.env.STEAM_API;
export const STEAM_API_KEY = process.env.STEAM_API_KEY;

export const HTTP_STATUS = {
	SUCCESSFUL: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	NOT_ACCEPTABLE: 406,
	REQUEST_TIMEOUT: 408,
};
