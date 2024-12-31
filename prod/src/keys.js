import { BD_HOST, BD_PORT, BD_USER, BD_PASSWORD, BD_NAME } from "./config.js";

export const database = {
	host: BD_HOST,
	port: BD_PORT,
	user: BD_USER,
	password: BD_PASSWORD,
	charset: "utf8mb4",
	database: BD_NAME,
	waitForConnections: true,
};
