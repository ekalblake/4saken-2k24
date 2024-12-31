import express from "express";
import morgan from "morgan";
import cors from "cors";
import { STEAM_API } from "./config.js";
import passport from "passport";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { database } from "./keys.js";

import * as strategy from "./strategies/steamStrategy.js";

var app = express();

app.use(
	cors({
		origin: [
			"http://localhost:5001",
			"http://localhost:5173",
			"http://34.205.139.113",
			"http://34.205.139.113:5001",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);


let sessionStore = new MySQLStore(database);

app.enable("trust proxy", true);

app.use(
	session({
		secret: STEAM_API,
		saveUninitialized: false,
		resave: false,
		cookie: {
			secure: false,
			maxAge: 365 * 24 * 60 * 60 * 1000,
			httpOnly: false,
		},
		expires: true,
		name: "4saken-session",
		store: sessionStore,
		proxy: true,
		rolling: true,
		waitTime: 0,
		sendTime: 0,
		userid: 0,
		steamid: 0,
	}),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("dev"));

export default app;
