import _ from "lodash";
import { chatEvents } from "./chatEvents.js";
import { queueEvents } from "./queueEvents.js";
import { roomEvents } from "./roomEvents.js";
import pool from "../database.js";

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

		io.emit("user:connect", userInfo);

		roomEvents(socket, io, userInfo);

		chatEvents(socket, io, userInfo);

		queueEvents(socket, io, userInfo);

		socket.on("disconnect", () => {
			connectedSockets = connectedSockets.filter((s) => s !== socket);

			io.emit("disconnect:user", userInfo);

			try {
				pool.query(`UPDATE users_web SET isonline = 0 WHERE WebID = ?`, [userInfo.UserID]);

				console.log(`User ${socket.id} disconnected.`);
			} catch (err) {
				console.log(err);
				console.log("No se pudo desconectar el usuario");
			}
		});
		//Delete Message as Admin
		/* socket.on("delete:message:admin", ({ chatid, room }) => {
			io.to(room).emit("delete:message:admin", chatid);
		}); */
	});
};
