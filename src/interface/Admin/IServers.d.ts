declare type IDisponibilidad = "RESERVED" | "FREE";

declare interface IServer {
	serverid: number;
	ip: string;
	port: number;
	extra: string;
	status: number;
	availability: IDisponibilidad;
}
