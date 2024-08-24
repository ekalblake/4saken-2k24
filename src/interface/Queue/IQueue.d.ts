declare interface IQueue extends IPlayer {
	queueid: number;
	isjoined: number;
	region: number;
	joined_date: string | Date;
}
export default IQueue;
