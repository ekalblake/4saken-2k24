import Gamedig from "gamedig";

export const serverAvailabilityService = async (ip, port) => {
	const response = await Gamedig.query({
		type: "left4dead2",
		host: ip,
		port: port,
	});
	return response;
};
