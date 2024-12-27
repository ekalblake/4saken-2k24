import axios from "../axios";
import { AxiosResponse } from "axios";

import useSocket from "@/composables/useSocket";

const socketInstance = useSocket();
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

	public readyQueue(userid: number | undefined, gameType: number): void {
		socketInstance.emit("queue:ready-queue", {
			userid,
			room: gameType,
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

	/**
	 * Verify all current games.
	 */
	/* public async currentGames() {
		const { data } = await axios.get(`/queue/currentgames`);
		return data;
	} */
}

export const queuesService = new QueuesService();
