import { HTTP_STATUS } from "../config.js";
import { sendMessage } from "../models/chatModel.js";

export const chatEvents = (socket, io, userInfo) => {
	const messageCounts = {};

	socket.on("chat:handle-send-message", ({ message, room }) => {
		const userId = message.userid;
		const currentTime = Date.now();

		if (!messageCounts[userId]) {
			messageCounts[userId] = {
				count: 0,
				lastTime: currentTime,
			};
		}

		const count = messageCounts[userId].count;
		const lastTime = messageCounts[userId].lastTime;
		const elapsedTime = currentTime - lastTime;

		if (count >= 1 && elapsedTime < 1000) {
			socket.to(room).emit("chat:user-alert", { message: "Estás enviando muchos mensajes!" });
			return;
		}

		messageCounts[userId].count += 1;
		messageCounts[userId].lastTime = currentTime;

		sendMessage(message)
			.then((response) => {
				const newMessage = {
					chatid: response.insertId,
					...message,
				};

				io.to(room).emit("chat:handle-recieve-message", newMessage);
			})
			.catch((err) => {
				io.to(`user_${userId}`).emit(
					"event:error-found",
					responseError(HTTP_STATUS.BAD_REQUEST, err, "No has podido mandar mensaje."),
				);
			});
	});

	socket.on("user:typing", ({ user, room }) => {
		socket.to(room).emit("user:typing", user);
	});
};
