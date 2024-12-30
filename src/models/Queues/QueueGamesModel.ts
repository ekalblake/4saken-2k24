import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";

export default class QueueGamesModel {
	private queuesGamesArray: QueueGamesItemModel[];

	public constructor(data: IQueueGame[]) {
		this.queuesGamesArray = [];
		data.forEach((queue) => this.queuesGamesArray.push(new QueueGamesItemModel(queue)));
	}

	public getQueueGames() {
		return this.queuesGamesArray;
	}

	public newGame(game: IQueueGame) {
		this.queuesGamesArray.push(new QueueGamesItemModel(game));
	}
}
