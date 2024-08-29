import IQueue from "@/interface/Queue/IQueue";
import axios from "../axios";
import { AxiosResponse } from "axios";

import useSocket from "@/composables/useSocket";

const socketInstance = useSocket();
export class QueuesService {
	public joinQueue(room: number): void {
		socketInstance.emit("queue:join-queue", {
			room,
		});
	}

	public dropQueue(userid: number | undefined, gameType: number): void {
		socketInstance.emit("queue:drop-queue", {
			userid,
			room: gameType,
		});
	}
	/**
	 * QUEUE: DROP AS ADMIN
	 * @param player
	 */
	public async dropQueueAdmin(steamid: number | undefined): Promise<any> {
		try {
			const response = await axios.delete(`/queue/drop/admin/${steamid}/`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	}

	/**
	 * QUEUE: GET
	 */
	public async getQueues(): Promise<any> {
		const { data } = await axios.get(`/queue/list`);
		return data;
	}

	/**
	 *
	 * @param playersQueue
	 */
	public async gameStarted(playersQueue: any) {
		await axios.post(`/queue/gamestarted`, playersQueue);
	}

	/**
	 * Verify all current games.
	 */
	public async currentGames() {
		const { data } = await axios.get(`/queue/currentgames`);
		return data;
	}

	public async getQueueStatus(gameType: number) {
		return await axios.get(`/queue/get-queue-status/${gameType}`);
	}
}

export const queuesService = new QueuesService();
