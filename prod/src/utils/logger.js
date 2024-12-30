import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "../../logs");
const LOG_FILE = path.join(LOG_DIR, "LOGS.txt");

fs.ensureDirSync(LOG_DIR);

class Logger {
	static async log(level, message, additionalInfo = {}, steamId = null) {
		const timestamp = new Date().toISOString();

		const steamIdInfo = steamId ? ` [SteamID: ${steamId}]` : "";

		const logMessage = `[${timestamp}] [${level}]${steamIdInfo} ${JSON.stringify(message)} ${
			Object.keys(additionalInfo).length ? `| Info: ${JSON.stringify(additionalInfo)}` : ""
		}\n`;

		try {
			await fs.appendFile(LOG_FILE, logMessage);
		} catch (err) {
			console.error("Error escribiendo en el archivo de logs:", err);
		}
	}

	static request(req, res = null) {
		const { method, url, params, query, body } = req;

		const userid = req.session?.userid || null;
		const steamid = req.session?.steamid || "Desconocido";

		const responseDetails = res ? { statusCode: res.statusCode, statusMessage: res.statusMessage } : null;

		const steamId = req.session?.steamid || "Desconocido";

		const message = `HTTP ${method} ${url}`;
		const additionalInfo = {
			params,
			query,
			body,
			...(responseDetails && { response: responseDetails }),
			userid,
			steamid,
		};

		this.log("REQUEST", message, additionalInfo, steamId);
	}

	static async response(req, res, responseBody) {
		const { method, url } = req;
		const steamId = req.session?.steamid || "Desconocido";

		const message = `HTTP ${method} ${url}`;

		const additionalInfo = {
			statusCode: res.statusCode,
			responseBody,
		};

		this.log("RESPONSE", message, additionalInfo, steamId);
	}

	static error(message, error, req = null) {
		const additionalInfo = {};

		const steamId = req.session?.steamid || "Desconocido";

		if (req) {
			additionalInfo.params = req.params || {};
			additionalInfo.query = req.query || {};
			additionalInfo.body = req.body || {};
		}

		if (error instanceof Error) {
			additionalInfo.errorMessage = error.message;
			additionalInfo.errorStack = error.stack;
		} else {
			additionalInfo.error = error;
		}

		const requestDetails = req ? `HTTP ${req.method} ${req.url}` : "No request details available";

		const logMessage = message || "An error occurred";
		const finalMessage = `${requestDetails} - ${logMessage}`;

		this.log("ERROR", finalMessage, additionalInfo, steamId);
	}

	static info(message, additionalInfo = {}) {
		this.log("INFO", message, additionalInfo);
	}

	static warn(message, additionalInfo = {}) {
		this.log("WARN", message, additionalInfo);
	}

	static debug(message, additionalInfo = {}) {
		this.log("DEBUG", message, additionalInfo);
	}
}

export default Logger;
