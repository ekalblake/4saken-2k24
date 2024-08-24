export class InformationItemModel {
	private onlinePlayers: number;
	private onlineAdmins: number;
	private onlineUser: number;

	constructor(data: IOnlineUser) {
		this.onlinePlayers = data.onlinePlayers;
		this.onlineAdmins = data.onlineAdmins;
		this.onlineUser = data.onlineUser;
	}

	public getAllOnline(): number {
		return this.onlinePlayers;
	}
	public getOnlineAdmins(): number {
		return this.onlineAdmins;
	}
	public getOnlineUser(): number {
		return this.onlineUser;
	}

	public setOnlineUsers(): number {
		return this.onlineUser++;
	}

	public setOnlineAdmins(): number {
		return this.onlineAdmins++;
	}

	public removeOnlineUsers(): number {
		return this.onlineUser--;
	}

	public removeOnlineAdmins(): number {
		return this.onlineAdmins--;
	}
}

export default InformationItemModel;
