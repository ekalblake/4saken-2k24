import passport from "passport";
import passportSteam from "passport-steam";
import { API_URL, STEAM_API_KEY } from "../config.js";

import pool from "../database.js";

import { getUserBySteamID, createUser, updateUser } from "../models/userModel.js";

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((user, done) => {
	done(null, user);
});

const SteamStrategy = passportSteam.Strategy;

const data = {
	returnURL: API_URL + "auth/redirect",
	realm: API_URL,
	apiKey: STEAM_API_KEY,
};

passport.use(
	new SteamStrategy(data, async (identifier, profile, done) => {
		try {
			const existingUser = await getUserBySteamID(profile.id);

			const { personaname, avatarfull, profileurl, personastate, timecreated } = profile._json;

			if (!existingUser) {
				const [rows] = await pool.query("SELECT MAX(WebID) AS maxWebID FROM users_general");
				const newIndex = (rows.maxWebID || 0) + 1;

				const steamUser = {
					WebID: newIndex,
					personaname,
					avatarfull,
					profileurl,
					timecreated,
					personastate,
				};
				await createUser(steamUser, profile.id, newIndex);
			} else {
				await updateUser(existingUser.SteamID64, { personaname, avatarfull, personastate });
			}

			done(null, profile);
		} catch (error) {
			return done(error, null);
		}
	}),
);
