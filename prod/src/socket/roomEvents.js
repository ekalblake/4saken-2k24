/************************************************************************************************************
 * Send Message Events
 * chat:handle-send-message -> All message information
 * istyping -> Brings if user is currently typing
 ***********************************************************************************************************/

import { HTTP_STATUS } from "../config";
import { setOnline } from "../query/room.querys";
import { responseError } from "../utils/errors";

export const roomEvents = (socket, io, userInfo) => {
	socket.on("room:join-room", (room) => {
		setOnline(userInfo.UserID)
			.then(() => {
				socket.join(room);
				io.emit("user:join-room", userInfo);
			})
			.catch((err) => {
				console.log(err);
				io.to(`user_${userInfo.UserID}`).emit(
					"event:error-found",
					responseError(HTTP_STATUS.BAD_REQUEST, err, "No has podido conectarte exitosamente."),
				);
			});
	});

	socket.on("onunmounted:room", (room) => {
		console.log(room);
		socket.leave(room);
	});

	/* socket.on("disconnect", () => {
		io.emit("disconnect:user", userInfo);

		try {
			pool.query(`UPDATE users_web SET isonline = 0 WHERE WebID = ?`, [userInfo.UserID]);

			console.log(`User ${socket.id} disconnected.`);
		} catch (err) {
			console.log(err);
			console.log("No se pudo desconectar el usuario");
		}
	}); */
};
