export class ServerItemModel {
	readonly ip: string;
	readonly map: string;
	readonly name: string;
	readonly maxplayers: number;
	readonly numplayers: number;
	readonly ping: number;
	readonly players: string[];

	constructor(data: IServerInfo) {
		this.ip = data.ip;
		this.map = data.map;
		this.name = data.name;
		this.maxplayers = data.maxplayers;
		this.numplayers = data.numplayers;
		this.ping = data.ping;
		this.players = data.players;
	}

	public getIp(): string {
		return this.ip;
	}

	public getServerMap(): string {
		return this.map;
	}

	public getName(): string {
		return this.name;
	}

	public getMaxPlayers(): number {
		return this.maxplayers;
	}

	public getNumPlayers(): number {
		return this.numplayers;
	}

	public getPing(): number {
		return this.ping;
	}

	public getPlayers(): string[] {
		return this.players;
	}
}
export default ServerItemModel;
