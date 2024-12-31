import axios from "../axios";
import { AxiosResponse } from "axios";

export class QueuesService {
	public joinQueue(room: number): Promise<AxiosResponse<IApiResponse<IUserWeb>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/queue/player/join`, {
					room,
				});

				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dropQueue(): Promise<AxiosResponse<IApiResponse>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.delete(`/queue/player/drop`);

				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public joinPartyQueue(
		room: number,
		party_id: number,
	): Promise<AxiosResponse<IApiResponse<{ members_id: number[] }>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/queue/party/join`, {
					room,
					party_id,
				});

				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dropPartyQueue(party_id: number): Promise<AxiosResponse<IApiResponse<{ members_id: number[] }>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.post(`/queue/party/drop`, {
					party_id,
				});

				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getRankedList(gameType: number): Promise<AxiosResponse<IApiResponse<IQueue[]>>> {
		return new Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(`/queue/get-queue-list/${gameType}`);
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}

	/**
	 * QUEUE: DROP AS ADMIN
	 * @param player
	 */
	/* public async dropQueueAdmin(steamid: number | undefined): Promise<any> {
		try {
			const response = await axios.delete(`/queue/drop/admin/${steamid}/`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	} */

	/**
	 *
	 * @param playersQueue
	 */
	/* public async gameStarted(playersQueue: any) {
		await axios.post(`/queue/gamestarted`, playersQueue);
	} */

	public async currentGames(room: number): Promise<AxiosResponse<IApiResponse<IQueueGame[]>>> {
		const response = await axios.get(`/queue/current-games`, {
			params: {
				room,
			},
		});
		return response;
	}
}

export const queuesService = new QueuesService();
