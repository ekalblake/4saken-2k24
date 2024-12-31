declare interface IChat extends IPlayer {
	chatid: number;
	message_body: string;
	room: number;
	created_at: number;
}

declare interface IChatMessage {
	message_body: string;
}
