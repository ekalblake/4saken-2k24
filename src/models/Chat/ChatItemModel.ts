import PlayerItemModel from "@/models/Player/PlayerItemModel";

export class ChatItemModel extends PlayerItemModel {
	private chatid: number;
	private message_body: string;
	private room: number;
	readonly created_at: any;
	private message_type: IMessageType;
	private message_data: ITypeText | ITypeFile;
	private parentid: number;

	constructor(data: IChat) {
		super(data);
		this.chatid = data.chatid;
		this.message_body = data.message_body;
		this.room = data.room;
		this.created_at = data.created_at;
		this.message_type = data.message_type;
		this.message_data = data.message_data;
		this.parentid = data.parentid;
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

	public getMessageData(): any {
		return this.message_data;
	}

	public getMessageType(): IMessageType {
		return this.message_type;
	}

	public getParentId(): number {
		return this.parentid;
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
