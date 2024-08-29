import PlayerItemModel from "@/models/Player/PlayerItemModel";

export default class PlayersModel {
	private playersArray: PlayerItemModel[];

	public constructor(data: IPlayer[]) {
		this.playersArray = [];
		data.forEach((players) =>
			this.playersArray.push(new PlayerItemModel(players)),
		);
	}

	public getPlayers(): PlayerItemModel[] {
		return this.playersArray;
	}
}
