import helpers from "@/utils/Dateformat";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

export class QueueItemModel extends PlayerItemModel {
	private queueid: number;
	private isjoined: number;
	private region: number;
	private joined_date: any;

	constructor(data: IQueue) {
		super(data);
		this.queueid = data.queueid;
		this.isjoined = data.isjoined;
		this.region = data.region;
		this.joined_date = data.joined_date;
	}

	public getQueueId(): number {
		return this.queueid;
	}
	public getIsJoinedQueue(): number {
		return this.isjoined;
	}
	public getRegionQueue(): number {
		return this.region;
	}
	public getJoinedDateQueue(): string {
		return helpers.timeago(new Date(this.joined_date * 1000));
	}

	public setIsJoined(isjoined: number) {
		this.isjoined = isjoined;
	}
}

export default QueueItemModel;
