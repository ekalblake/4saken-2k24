export const chatEvents = (socket, io) => {
	socket.on("chat:handle-send-message", ({ message, room }) => {
		io.to(room).emit("chat:handle-recieve-message", message);
	});

	socket.on("user:typing", ({ user, room }) => {
		socket.to(room).emit("user:typing", user);
	});
};
