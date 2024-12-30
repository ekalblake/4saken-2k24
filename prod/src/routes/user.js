import express from "express";
import { isAuthorized } from "../auth/auth-steam.js";
import {
	fetchUser,
	listUser,
	onlineListUser,
	userConfiguration,
	failedUser,
	getUserMmr,
	getConnectionStatus,
	updateRegion,
	createParty,
	joinParty,
	checkParty,
	removePartyMember,
	deleteParty,
	checkCurrentGame,
	getServerListPublic,
} from "../controllers/user.controller.js";

const router = express.Router();

router
	.get("/failed", failedUser)
	.get("/start", isAuthorized, fetchUser)
	.put("/update-region", isAuthorized, updateRegion)
	.post("/party/create-party", createParty)
	.post("/party/join-party", joinParty)
	.get("/party/verify-party-status", checkParty)
	.delete("/party/drop-party/:party_id", removePartyMember)
	.delete("/party/drop-party-room/:party_id", deleteParty)
	.get("/get/users", listUser)
	.get("/get/online-users", onlineListUser)
	.put("/config", userConfiguration)
	.get("/get/mmr", getUserMmr)
	.get("/online-status", getConnectionStatus)
	.get("/get/current-game", checkCurrentGame)
	.get("/server/public", getServerListPublic);
export default router;
