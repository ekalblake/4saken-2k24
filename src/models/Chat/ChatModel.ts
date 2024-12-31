import ChatItemModel from "@/models/Chat/ChatItemModel";

export default class ChatModel {
	readonly chatArray: ChatItemModel[];

	public constructor(data: IChat[]) {
		this.chatArray = [];
		data.forEach((chat) => this.chatArray.push(new ChatItemModel(chat)));
	}
	public getChats(): ChatItemModel[] {
		return this.chatArray;
	}

	public addMessage(message: IChat) {
		this.chatArray.push(new ChatItemModel(message));
	}

	public removeMessage(messageid: number) {
		this.chatArray.splice(messageid, 0);
	}
}
