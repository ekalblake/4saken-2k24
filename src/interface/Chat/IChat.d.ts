declare type IMessageType = "TEXT" | "AUDIO" | "VIDEO" | "FILE" | "IMAGE" | "REPLY_TO";

declare interface ITypeText {
	text: string;
}

declare interface ITypeFile {
	destination: string;
	filename: string;
	mimetype: string;
	original_name: string;
}

declare interface IChat extends IPlayer {
	chatid: number;
	message_body: string;
	room: number;
	created_at: string;
	message_type: IMessageType;
	message_data: ITypeText | ITypeFile | any;
	parentid: number;
}

declare interface IChatMessage {
	message_type: IMessageType;
	message_data: ITypeText | ITypeFile | any;
	parentid: number;
}

declare type IMessageObj = Omit<IChatMessage, "parentid">;

declare interface Window {
	streamAudio?: MediaStream; // Cambia el tipo según corresponda
}
