import ServerItemModel from "@/models/Admin/ServerItemModel";

export default class ServerModel {
	private serverArray: ServerItemModel[];

	public constructor(data: IServer[]) {
		this.serverArray = [];
		data.forEach((chat: IServer) => this.serverArray.push(new ServerItemModel(chat)));
	}

	public getServerArray(): ServerItemModel[] {
		return this.serverArray;
	}

	public filterServer(serverid: number) {
		this.serverArray = this.serverArray.filter((server) => server.getServerId() != serverid);
	}

	public removeServer(index: number) {
		this.serverArray.splice(index, 1);
	}

	public addServer(server: IServer) {
		this.serverArray.push(new ServerItemModel(server));
	}
}
