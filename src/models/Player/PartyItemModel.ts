import PlayersModel from "./PlayersModel";

class PartyInfoItemModel {
	private avatarfull: string;
	private colorChat: string;
	private glowColor: string;
	private leader_id: number;
	private leader_name: string;
	private party_id: number;
	private profileurl: string;
	private status: string;
	private party_code: string;

	constructor(data: IPartyInfo) {
		this.avatarfull = data.avatarfull;
		this.colorChat = data.colorChat;
		this.glowColor = data.glowColor;
		this.profileurl = data.profileurl;

		this.leader_id = data.leader_id;
		this.leader_name = data.leader_name;
		this.party_id = data.party_id;
		this.status = data.status;
		this.party_code = data.party_code;
	}

	public getAvatarFull(): string {
		return this.avatarfull;
	}

	public getColorChat(): string {
		return this.colorChat;
	}

	public getColorStyle(): string {
		return `box-shadow: 0px 0px 5px ${this.colorChat};`;
	}

	public getBackgroundColor(): any {
		return {
			backgroundColor: this.colorChat,
		};
	}

	public getGlowColor(): string {
		return this.glowColor;
	}

	public getLeaderId(): number {
		return this.leader_id;
	}

	public getLeaderName(): string {
		return this.leader_name;
	}

	public getPartyId(): number {
		return this.party_id;
	}

	public getProfileUrl(): string {
		return this.profileurl;
	}

	public getStatus(): string {
		return this.status;
	}

	public getPartyCode(): string {
		return this.party_code;
	}
}

export default class PartyItemModel {
	private members: IPlayer[];
	private party: IPartyInfo;

	constructor(data: { members: IPlayer[]; party: IPartyInfo }) {
		this.members = data.members;
		this.party = data.party;
	}

	public getMembers(): PlayersModel {
		return new PlayersModel(this.members);
	}

	public getParty(): PartyInfoItemModel {
		return new PartyInfoItemModel(this.party);
	}
}
