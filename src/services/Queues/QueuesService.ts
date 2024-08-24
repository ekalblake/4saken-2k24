import axios from "../axios";

export class QueuesService {
	/**
	 * Queue: Insert Player
	 * @param playerObject
	 */
	public async joinQueue(playerObject: {
		userid: number | undefined;
		region: number;
	}): Promise<any> {
		try {
			const response = await axios.post(`/queue/join`, playerObject);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	}

	/**
	 * QUEUE: DROP PLAYER
	 * @param player
	 */
	public async dropQueue(region: number): Promise<any> {
		try {
			const response = await axios.delete(`/queue/drop/${region}`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	}
	/**
	 * QUEUE: DROP AS ADMIN
	 * @param player
	 */
	public async dropQueueAdmin(steamid: number | undefined): Promise<any> {
		try {
			const response = await axios.delete(
				`/queue/drop/admin/${steamid}/`,
			);
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

	public async getQueueStatus() {
		try {
			const response = await axios.get(`/queue/get-queue-status`);
			return response.data;
		} catch ({ response }) {
			return response;
		}
	}
}

export const queuesService = new QueuesService();
