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

	public sendMessage(room: number, messageData: any): Promise<AxiosResponse<IApiResponse<IChat>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/chat/send/${room}`, messageData);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public uploadFiles(formData: FormData): Promise<AxiosResponse<IApiResponse<ITypeFile>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/user/upload`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}
}

export const chatService = new ChatService();
