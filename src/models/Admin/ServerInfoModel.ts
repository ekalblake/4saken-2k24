import ServerInfoItemModel from "@/models/Admin/ServerInfoItemModel";

export default class ServerModel {
	readonly serverInfoArray: ServerInfoItemModel[];

	public constructor(data: IServerInfo[]) {
		this.serverInfoArray = [];
		data.forEach((server: IServerInfo) => this.serverInfoArray.push(new ServerInfoItemModel(server)));
	}
	public getServerInfoArray(): ServerInfoItemModel[] {
		return this.serverInfoArray;
	}
}
