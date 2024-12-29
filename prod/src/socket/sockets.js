import _ from "lodash";
import { Server as WebSocketServer } from "socket.io";

import { chatEvents } from "./chatEvents.js";
import { queueEvents } from "./queueEvents.js";
import { roomEvents } from "./roomEvents.js";
import { generalEvents } from "./generalEvents.js";
import { handleSocketError } from "../utils/errors.js";
import { setOnline } from "../models/roomModel.js";
import { disconnectUser } from "../models/generalModel.js";

export let io;

export let connectedSockets = new Map();

export default (server) => {
	io = new WebSocketServer(server, {
		cors: {
			origin: [
				"https://4saken.us",
				"https://forsaken-blk.herokuapp.com",
				"http://forsaken-blk.herokuapp.com",
				"http://4saken.us",
				"http://localhost:5001",
				"http://localhost:5173",
			],
			methods: ["GET", "POST", "PUT", "DELETE"],
		},
	});

	io.on("connection", async (socket) => {
		const userInfo = socket.handshake.auth.userInfo;

		try {
			if (connectedSockets.has(userInfo.UserID)) {
				const existingSocket = connectedSockets.get(userInfo.UserID);
				existingSocket.disconnect();
				console.log(`Socket duplicado para el usuario ${userInfo.UserID} desconectado.`);
			}

			setOnline(userInfo.UserID);

			io.emit("user:connect", userInfo.Rol);

			connectedSockets.set(userInfo.UserID, socket);

			socket.join(`user_${userInfo.UserID}`);

			generalEvents(socket, io);

			roomEvents(socket, io, userInfo);

			chatEvents(socket, io);

			queueEvents(socket, io, userInfo);

			socket.on("disconnect", async () => {
				connectedSockets.delete(userInfo.UserID);

				await disconnectUser(userInfo.UserID);
				console.log(`User ${socket.id} disconnected.`);
				io.emit("disconnect:user", userInfo);
			});

			socket.on("ping:check", (callback) => {
				callback();
			});
		} catch (err) {
			handleSocketError(socket, "socket-error", err, userInfo.UserID);
		}
	});
};
