import io from "socket.io-client";
import { API_URL } from "../constants/constants";

const socket = io(API_URL, { autoConnect: false });

socket.onAny((event, ...args) => {
	console.log(event, args);
});

export default function useSocket() {
	return socket;
}
