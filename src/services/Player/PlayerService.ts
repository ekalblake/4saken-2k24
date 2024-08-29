import { AxiosResponse } from "axios";
import axios from "../axios";

export class PlayerService {
	public async getUser(): Promise<AxiosResponse<IPlayer>> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.get(`/login/start`);
				resolve(data);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getOnlineUsers(): Promise<any> {
		const { data } = await axios.get(`/getstatus`);
		return data[0];
	}

	public async getUsers(): Promise<IPlayer[]> {
		const { data } = await axios.get(`/login/get/users`);
		return data;
	}

	public async getOnlinePlayerList(): Promise<any> {
		return await axios.get(`/login/get/onlineusers`);
	}
	public async saveConfiguration(colorChat: any, glowColor: any, userid: any) {
		const { data } = await axios.put(`/login/config`, {
			colorChat: colorChat,
			glowColor: glowColor,
			userid: userid,
		});
		return data;
	}
}

export const playerService = new PlayerService();
