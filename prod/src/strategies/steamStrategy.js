import passport from "passport";
import passportSteam from "passport-steam";
import { API_URL, STEAM_API_KEY } from "../config.js";

import { createNewUser } from "../query/users.querys.js";

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
		createNewUser(profile)
			.then(() => {
				done(null, profile);
			})
			.catch((err) => {
				console.log(err);
				done(profile, null);
			});
	}),
);
