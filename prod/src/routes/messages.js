import express from "express";
import {
	sendMessage,
	deleteMessageAsAdmin,
} from "../controllers/messages.controller.js";
import { isAuthorized } from "../auth/auth-steam.js";

import { getMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router
	.get("/:room", getMessages)
	.post("/send", isAuthorized, sendMessage)
	.delete("/delete/:chatid", isAuthorized, deleteMessageAsAdmin);

/**
 * TODO: RANKED + GROUPS CHATS
 */

export default router;
