import { AxiosResponse } from "axios";
import axios from "../axios";

export class ChatService {
	/* public async deleteMessageAsAdmin(chatid: number): Promise<any> {
		try {
			const response = await axios.delete(`/messages/delete/${chatid}`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	} */

	public async getRoomMessages(room: number): Promise<AxiosResponse<IApiResponse<IChat[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/chat/${room}`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public sendMessage(message_body: IChatMessage, room: number): Promise<AxiosResponse<IApiResponse<IChat>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/chat/send/${room}`, message_body);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}
}

export const chatService = new ChatService();
