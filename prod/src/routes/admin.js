import express from "express";
import {
	newServer,
	deleteServer,
	getMapList,
	getServerListAdmin,
} from "../controllers/admin.controller.js";
import { isAuthorized } from "../auth/auth-steam.js";

import { isAdmin } from "../middleware/verifyadmin.middleware.js";

const router = express.Router();

router
	.get("/server/list", isAdmin, getServerListAdmin)
	.delete("/server/delete/:serverid", isAuthorized, deleteServer)
	.post("/server/add", isAuthorized, isAdmin, newServer)
	.get("/map/list", getMapList);

export default router;
