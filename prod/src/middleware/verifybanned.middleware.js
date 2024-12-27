import errors from "../utils/errors.js";
import { HTTP_STATUS } from "../config.js";
import { getSteamIdById, getBannedById } from "../models/userModel.js";

export const isBanned = async (req, res, next) => {
	try {
		const userid = req.session.userid;
		//Revisar por id para obtener el steamid
		const checkUser = await getSteamIdById(userid);

		const steamidText = steam().convertToText(checkUser[0].SteamID64);
		const checkBanned = await getBannedById(steamidText);
		if (checkBanned.length === 0) return next();

		return res.json(
			errors.response(
				HTTP_STATUS.FORBIDDEN,
				"Actualmente estás baneado. Visita El SourceBans para más información. Razón: " + checkBanned[0].reason,
			),
		);
	} catch (err) {
		console.log(err);
		res.json(errors.response(HTTP_STATUS.FORBIDDEN, "No se puede verificar si está baneado."));
	}
};
