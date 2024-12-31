import express from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { isAuthorized } from "../auth/auth-steam.js";

import { getMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:room", getMessages).post("/send/:room", isAuthorized, sendMessage);

export default router;
