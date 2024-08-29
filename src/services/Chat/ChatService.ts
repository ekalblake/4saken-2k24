import axios from "../axios";
import useSocket from "@/composables/useSocket";

const socketInstance = useSocket();
export class ChatService {
	/* public async deleteMessageAsAdmin(chatid: number): Promise<any> {
		try {
			const response = await axios.delete(`/messages/delete/${chatid}`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	} */

	/**
	 * ROOM 1 : SOLO
	 * ROOM 2 : RANKED
	 * ROOM 3 : TEAMS
	 */

	/* public async getMessageUnranked(room: number): Promise<any> {
		return await axios.get(`/messages/${room}`);
	} */

	/**
	 * TODO GET MESSAGES RANKED + TEAMS
	 */

	public async getRoomMessages(room: number): Promise<IChat[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.get(`messages/${room}`);
				resolve(data);
			} catch (err) {
				reject(err);
			}
		});
	}

	public sendMessage(message: any, gameType: number): void {
		socketInstance.emit("chat:handle-send-message", {
			message,
			room: gameType,
		});
	}
}

export const chatService = new ChatService();
