import { disconnectUser } from "../models/generalModel.js";
import { SOCKET_MESSAGES } from "../utils/constants.js";
import { handleSocketError } from "../utils/errors.js";

export const generalEvents = (socket, io, connectedSockets, userInfo) => {
	socket.on("disconnect", async () => {
		connectedSockets = connectedSockets.filter((s) => s.socket !== socket);

		try {
			await disconnectUser(userInfo.UserID);
			console.log(`User ${socket.id} disconnected.`);
			io.emit("disconnect:user", userInfo);
		} catch (err) {
			handleSocketError(socket, "socket-error", err, SOCKET_MESSAGES.SOCKET_DISCONNECT_ERROR);
		}
	});
};
