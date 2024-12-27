import express from "express";
import passport from "passport";
import { CLIENT_URL } from "../config.js";
import { isAuthorized, isNotAuthorized } from "../auth/auth-steam.js";

const router = express.Router();

router
	.get("/login", isNotAuthorized, passport.authenticate("steam", { failureRedirect: "/" }), function (req, res) {
		res.redirect("/login/user");
	})
	.get(
		"/redirect",
		passport.authenticate("steam", {
			failureRedirect: "/login/failed",
		}),
	)
	.get("/logout", isAuthorized, (req, res, next) => {
		req.logout(function (err) {
			if (err) {
				return next(err);
			}
			res.redirect(CLIENT_URL);
		});
	});

export default router;
