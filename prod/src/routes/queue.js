import express from "express";
import { HTTP_STATUS } from "../config.js";
import pool from "../database.js";
import { isAuthorized } from "../auth/auth-steam.js";
import errors from "../utils/errors.js";
import steam from "steamidconvert";

import {
	playerJoinQueue,
	playerDropQueue,
	dropQueueAdmin,
	currentGames,
	matchStatus,
	getMatchInfo,
	matchStatusV2,
	getQueueList,
	partyJoinQueue,
	partyDropQueue,
} from "../controllers/queue.controller.js";
import { isBanned } from "../middleware/verifybanned.middleware.js";
import { isAdmin } from "../middleware/verifyadmin.middleware.js";

const router = express.Router();

router
	.post("/player/join", isAuthorized, /* isBanned, */ playerJoinQueue)
	.delete("/player/drop", isAuthorized, playerDropQueue)
	.delete("/drop/admin/:userid/:region", isAuthorized, isAdmin, dropQueueAdmin)
	.post("/party/join", isAuthorized, partyJoinQueue)
	.post("/party/drop", isAuthorized, partyDropQueue)
	.get("/checkqueue", isAuthorized, async (req, res) => {
		const steamid = steam().convertToText(req.session.passport.user.id);

		const verifyStatus = await pool.query(
			"SELECT isjoined FROM `4saken`.l4d2_queue where isjoined = 2 and region = 4 and steamid = ?",
			[steamid],
		);

		if (verifyStatus.length != 0) {
			res.json(errors.response(HTTP_STATUS.SUCCESSFUL, "Ready"));
		} else {
			res.json(errors.response(HTTP_STATUS.REQUEST_TIMEOUT, "Unready"));
		}
	})
	.get("/current-games", currentGames)

	.get("/matchstatus", matchStatus)

	.get("/matchstatusV2", matchStatusV2)

	.get("/get-match-info", getMatchInfo)

	.get("/get-queue-list/:gametype", getQueueList);

export default router;
