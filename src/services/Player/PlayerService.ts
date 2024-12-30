import { AxiosResponse } from "axios";
import axios from "../axios";

export class PlayerService {
	public getUser(): Promise<AxiosResponse<IApiResponse<IPlayer>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/start`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getOnlineUsers(): Promise<AxiosResponse<IApiResponse<IOnlineUser>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/online-status`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public updateRegions(regions: string): Promise<AxiosResponse<IApiResponse>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.put(`/user/update-region`, {
					regions,
				});
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public newParty(): Promise<AxiosResponse<IApiResponse>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/user/party/create-party`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public verifyParty(): Promise<AxiosResponse<IApiResponse<{ members: IPlayer[]; party: IPartyInfo }>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/party/verify-party-status`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public joinParty(party_code: string): Promise<AxiosResponse<IApiResponse<number[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/user/party/join-party`, {
					party_code,
				});
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dropPartyMember(party_id: number): Promise<AxiosResponse<IApiResponse<number[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.delete(`/user/party/drop-party/${party_id}`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dropParty(party_id: number): Promise<AxiosResponse<IApiResponse<number[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.delete(`/user/party/drop-party-room/${party_id}`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public getCurrentGame(): Promise<AxiosResponse<IApiResponse<IQueueGame>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/get/current-game`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getUsers(): Promise<AxiosResponse<IApiResponse<IPlayer[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/get/users`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getOnlinePlayerList(): Promise<AxiosResponse<IApiResponse<IPlayer[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/get/online-users`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async saveConfiguration(colorChat: string | undefined, glowColor: string | undefined) {
		const response = await axios.put(`/user/config`, {
			colorChat: colorChat,
			glowColor: glowColor,
		});
		return response;
	}

	public async getServerListPublic(): Promise<AxiosResponse<IApiResponse<IServerInfo[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/user/server/public`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}
}

export const playerService = new PlayerService();
