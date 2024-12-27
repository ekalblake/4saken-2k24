export const roomEvents = (socket, io, userInfo) => {
	socket.on("room:join-room-emit", (room) => {
		socket.join(room);
		io.emit("room:join-room", userInfo);
	});

	socket.on("room:leave-room", (room) => {
		socket.leave(room);
	});
};
