import { QueueItemModel } from "@/models/Queues/QueueItemModel";

export default class QueueModel {
	private queuesArray: QueueItemModel[];

	public constructor(data: IQueue[]) {
		this.queuesArray = [];
		data.forEach((queue) => this.queuesArray.push(new QueueItemModel(queue)));
	}

	public getQueue(): QueueItemModel[] {
		return this.queuesArray;
	}

	public filterQueue(userid: number) {
		this.queuesArray = this.queuesArray.filter((player) => player.getUserId() != userid);
	}

	public pushQueue(user: IQueue) {
		this.queuesArray.push(new QueueItemModel(user));
	}
}
