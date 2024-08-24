declare interface IChat extends IPlayer {
	chatid: number;
	message_body: string;
	room: number;
	created_at: string;
}
