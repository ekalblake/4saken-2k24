import _ from "lodash";
import { chatEvents } from "./chatEvents.js";
import { queueEvents } from "./queueEvents.js";
import { roomEvents } from "./roomEvents.js";
import { generalEvents } from "./generalEvents.js";
import { handleSocketError } from "../utils/errors.js";
import { setOnline } from "../models/roomModel.js";

let queueArray = [];

//SOCKET IO
let connectedSockets = [];
export default (io) => {
	io.on("connection", async (socket) => {
		const userInfo = socket.handshake.auth.userInfo;

		try {
			const existingIndex = connectedSockets.findIndex((s) => s.userInfo.UserID === userInfo.UserID);

			if (existingIndex !== -1) {
				connectedSockets[existingIndex].socket.disconnect();
				connectedSockets.splice(existingIndex, 1);
				console.log(`Socket duplicado para el usuario ${userInfo.UserID} desconectado.`);
			}

			setOnline(userInfo.UserID);

			io.emit("user:connect", userInfo.Rol);

			connectedSockets.push({ socket, userInfo });

			socket.join(`user_${userInfo.UserID}`);

			generalEvents(socket, io, connectedSockets, userInfo);

			roomEvents(socket, io, userInfo);

			chatEvents(socket, io, userInfo);

			queueEvents(socket, io, userInfo, queueArray);
		} catch (err) {
			handleSocketError(socket, "socket-error", err, userInfo.UserID);
		}
	});
};
