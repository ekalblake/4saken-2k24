import PlayerItemModel from "@/models/Player/PlayerItemModel";

export class ChatItemModel extends PlayerItemModel {
	readonly chatid: number;
	readonly message_body: string;
	readonly room: number;
	readonly created_at: any;

	constructor(data: IChat) {
		super(data);
		this.chatid = data.chatid;
		this.message_body = data.message_body;
		this.room = data.room;
		this.created_at = data.created_at;
	}

	public getChatId(): number {
		return this.chatid;
	}
	public getMessageChat(): string {
		return this.message_body;
	}
	public getRoomChat(): number {
		return this.room;
	}
	public getCreatedAt(): string {
		return this.created_at;
	}
	public getCreatedDateChat(): string | Date {
		const date = new Date(this.created_at * 1000);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		const formattedHours = hours % 12 || 12;
		const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
		return formattedHours + ":" + formattedMinutes + " " + ampm;
	}
}
export default ChatItemModel;
