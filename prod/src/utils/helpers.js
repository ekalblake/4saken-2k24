import _ from "lodash";
import { getActiveServers } from "../models/generalModel.js";
import { serverAvailabilityService } from "../services/extraServices.js";
const helpers = {};

helpers.unixToDate = (date) => {
	const getDate = new Date(date * 1000).toLocaleString();
	return getDate;
};

helpers.currentDate = () => {
	return Math.floor(new Date().getTime() / 1000.0);
};

export const getRandomMaps = () => {
	let map = [
		"c1m1_hotel",
		"c2m1_highway",
		"c3m1_plankcountry",
		"c4m1_milltown_a",
		"c5m1_waterfront",
		"c6m1_riverbank",
		"c8m1_apartment",
		"c10m1_caves",
		"c11m1_greenhouse",
		"c12m1_hilltop",
		"c13m1_alpinecreek",
	];

	return _.sample(map);
};

export const reserveIp = async () => {
	const getServers = await getActiveServers();

	let checkActiveServer = null;

	for (let server of getServers) {
		try {
			const data = await serverAvailabilityService(server.ip, server.port);
			if (data.raw.numplayers == 0) {
				checkActiveServer = {
					name: data.name,
					ip: data.connect,
				};
				break;
			}
		} catch (err) {
			console.log(`No se ha encontrado el servidor: ${server.ip} - ${err.message}`);
		}
	}

	return checkActiveServer;
};

//https://codingnconcepts.com/javascript/how-to-divide-array-in-equal-parts-in-javascript/

export const getRandomCode = () => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";
	for (let i = 0; i < 8; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters[randomIndex];
	}
	return code;
};

export const generateMatchId = () => {
	const timestamp = Math.floor(Date.now() / 1000);
	const randomNum = Math.floor(Math.random() * 10000);
	return `L4D2MATCH-${timestamp}-${randomNum}`;
};

export default helpers;
