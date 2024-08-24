import ChatItemModel from "@/models/Chat/ChatItemModel";

export default class ChatModel {
	readonly chatArray: IChat[];

	public constructor(data: IChat[]) {
		this.chatArray = [];
		data.forEach((chat) => this.chatArray.push(new ChatItemModel(chat)));
	}
	public getChats(): any {
		return this.chatArray;
	}
}
