import axios from "../axios";
import { AxiosResponse } from "axios";

import useSocket from "@/composables/useSocket";

const socketInstance = useSocket();
export class QueuesService {
	public joinQueue(room: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.post(`/queue/player/join`, {
					room,
				});

				socketInstance.emit("queue:join-queue", {
					room,
					userInfo: data.data,
				});

				resolve(data);
			} catch (err) {
				reject(err);
			}
		});
	}

	public dropQueue(userid: number | undefined, gameType: number): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.delete(`/queue/player/drop`);

				socketInstance.emit("queue:drop-queue", {
					userid,
					room: gameType,
				});

				resolve(data);
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

	public async getRankedList(gameType: number): Promise<IQueue[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const { data } = await axios.get(`/queue/get-queue-list/${gameType}`);
				resolve(data);
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
