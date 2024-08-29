import _ from "lodash";
import { chatEvents } from "./chatEvents.js";
import { queueEvents } from "./queueEvents.js";
import { roomEvents } from "./roomEvents.js";

export default (io) => {
	//SOCKET IO
	let connectedSockets = [];

	io.on("connection", async (socket) => {
		if (connectedSockets.indexOf(socket) !== -1) {
			console.log("Socket already connected");
			return;
		}

		connectedSockets.push(socket);

		const userInfo = socket.handshake.auth.userInfo;

		socket.join(`user_${userInfo.UserID}`);

		roomEvents(socket, io, userInfo);

		chatEvents(socket, io, userInfo);

		queueEvents(socket, io, userInfo);

		socket.on("disconnect", () => {
			connectedSockets = connectedSockets.filter((s) => s !== socket);
		});
		//Delete Message as Admin
		/* socket.on("delete:message:admin", ({ chatid, room }) => {
			io.to(room).emit("delete:message:admin", chatid);
		}); */
	});
};
