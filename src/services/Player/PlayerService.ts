import { AxiosResponse } from "axios";
import axios from "../axios";

export class PlayerService {
	public async getUser(): Promise<AxiosResponse<IPlayer>> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.get(`/user/start`);
				resolve(data);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getOnlineUsers(): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.get(`/user/connection-status`);
				resolve(data);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getUsers(): Promise<IPlayer[]> {
		const { data } = await axios.get(`/user/get/users`);
		return data;
	}

	public async getOnlinePlayerList(): Promise<any> {
		return await axios.get(`/user/get/onlineusers`);
	}
	public async saveConfiguration(colorChat: any, glowColor: any, userid: any) {
		const { data } = await axios.put(`/user/config`, {
			colorChat: colorChat,
			glowColor: glowColor,
			userid: userid,
		});
		return data;
	}
}

export const playerService = new PlayerService();
