import { AxiosResponse } from "axios";
import axios from "../axios";

export class AdminService {
	public async getServerList(): Promise<AxiosResponse<IApiResponse<IServer[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/admin/server/list`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}


	public async deleteServer(serverid: number): Promise<AxiosResponse<IApiResponse>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.delete(`/admin/server/delete/${serverid}`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async newServer(server: {
		ip: string;
		extra: string;
		port: number;
	}): Promise<AxiosResponse<IApiResponse<IServer>>> {
		const response = await axios.post(`/admin/server/add`, {
			ip: server.ip,
			port: server.port,
			extra: server.extra,
		});
		return response;
	}
}

export const adminService = new AdminService();
