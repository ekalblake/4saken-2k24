import { defineStore } from "pinia";
import { playerService } from "../services/Player/PlayerService";
import UserItemModel from "../models/Player/PlayerItemModel";
import useSocket from "../composables/useSocket";
import { API_URL } from "@/constants/constants";
import InformationItemModel from "@/models/Player/InformationItemModel";

const socket = useSocket();

interface UserState {
	userInfo: UserItemModel | null;
	isSocketConnected: boolean;
	onlineInformation: InformationItemModel | null;
}

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userInfo: null,
		isSocketConnected: false,
		onlineInformation: null,
	}),
	actions: {
		async fetchUserInfo() {
			try {
				const response = await playerService.getUser();
				this.setUserInfo(response.data.data);
				this.socketConnect();
				this.getOnlineUsers();
			} catch (error) {
				this.removeLocalStorage();
			}
		},
		setUserInfo(data: IPlayer) {
			this.userInfo = new UserItemModel(data);

			const parseObject = JSON.stringify(data);

			localStorage.setItem("user", parseObject);
		},
		setUserInfoNull() {
			this.userInfo = null;

			localStorage.removeItem("user");

			window.open(API_URL + "/auth/logout", "_self");
		},
		async checkAuthentication() {
			if (!this.userInfo) {
				await this.fetchUserInfo();
			}
			return !!this.userInfo;
		},
		async getOnlineUsers() {
			playerService
				.getOnlineUsers()
				.then((response) => {
					this.onlineInformation = new InformationItemModel(response.data.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		removeLocalStorage() {
			this.userInfo = null;

			localStorage.removeItem("user");
		},
		socketConnect() {
			if (this.isSocketConnected) return;

			const userInfo = this.userInfo;

			socket.auth = { userInfo };

			socket.off("connect");
			socket.off("disconnect");
			socket.off("connect_error");
			socket.off("reconnect_attempt");
			socket.off("reconnect");
			socket.off("reconnect_failed");

			socket.connect();

			socket.on("connect", () => {
				this.isSocketConnected = true;

				socket.emit("register", {
					user_id: this.userInfo?.getUserId(),
				});
			});

			setInterval(() => {
				const startTime = Date.now();
				socket.emit("ping:check", () => {
					const latency = Date.now() - startTime;
					/* console.log(`Latencia: ${latency} ms`); */
				});
			}, 5000);

			socket.on("disconnect", (reason: string) => {
				console.log(reason);
				console.warn("Desconectado del Socket:", reason);
				this.isSocketConnected = false;
			});

			socket.on("connect_error", (err: any) => {
				console.error("Error de conexión:", err.message);
			});

			socket.on("reconnect_attempt", (attemptNumber: number) => {
				console.log(`Intentando reconexión: ${attemptNumber}`);
			});

			socket.on("reconnect", (attemptNumber: number) => {
				console.log(`Reconectado exitosamente después de ${attemptNumber} intento(s).`);
				this.isSocketConnected = true;

				socket.emit("register", {
					user_id: this.userInfo?.getUserId(),
				});
			});

			socket.on("reconnect_failed", () => {
				console.error("Reconexión fallida. No se pudo establecer conexión con el servidor.");
				this.isSocketConnected = false;
			});
			// Medir latencia cada 5 segundos
			this.startPingInterval();
		},
		startPingInterval() {
			if (socket.pingInterval) return; // Evitar intervalos múltiples

			socket.pingInterval = setInterval(() => {
				const startTime = Date.now();
				socket.emit("ping:check", () => {
					const latency = Date.now() - startTime;
					console.log(`Latencia: ${latency} ms`);
				});
			}, 5000);
		},
		stopPingInterval() {
			if (socket.pingInterval) {
				clearInterval(socket.pingInterval);
				socket.pingInterval = null;
			}
		},
		userConnect(rol: number) {
			if (rol == 1 || rol == 3) this.onlineInformation?.setOnlineUsers();

			if (rol == 2) this.onlineInformation?.setOnlineAdmins();
		},
		usersDisconnect(userInfo: IPlayer) {
			if (userInfo.Rol == 1 || userInfo.Rol == 3) this.onlineInformation?.removeOnlineUsers();

			if (userInfo.Rol == 2) this.onlineInformation?.removeOnlineAdmins();
		},
	},
	getters: {
		getUserInfo: (state) => state.userInfo,
	},
});
