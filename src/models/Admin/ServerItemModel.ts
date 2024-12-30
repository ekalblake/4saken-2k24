export class ServerItemModel {
	private serverid: number;
	private ip: string;
	private port: number;
	private extra: string;
	private status: number | undefined;
	private availability: IDisponibilidad;

	constructor(data: IServer) {
		this.serverid = data.serverid;
		this.ip = data.ip;
		this.port = data.port;
		this.extra = data.extra;
		this.status = data.status;
		this.availability = data.availability;
	}

	public getServerId(): number {
		return this.serverid;
	}

	public getIp(): string {
		return this.ip;
	}

	public getPort(): number {
		return this.port;
	}

	public getExtra(): string {
		return this.extra;
	}

	public getStatus(): number | undefined {
		return this.status;
	}

	public getDisponibilidad(): IDisponibilidad {
		return this.availability;
	}
}
export default ServerItemModel;
