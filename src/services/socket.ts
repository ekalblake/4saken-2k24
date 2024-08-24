import { io } from "socket.io-client";
import { API_URL } from "@/constants/constants";

const socketInstance = io(API_URL, { autoConnect: false });

socketInstance.onAny((event, ...args) => {
	console.log(event, args);
});

export default socketInstance;
