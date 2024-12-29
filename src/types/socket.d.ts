declare module "socket.io-client" {
	interface Socket {
		pingInterval?: NodeJS.Timeout; // Definir la propiedad personalizada
	}
}
