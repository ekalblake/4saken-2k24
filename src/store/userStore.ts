import { defineStore } from "pinia";
import { playerService } from "../services/Player/PlayerService";
import UserItemModel from "../models/Player/PlayerItemModel";
import useSocket from "../composables/useSocket";
import { API_URL } from "@/constants/constants";

const socket = useSocket();

interface UserState {
	userInfo: UserItemModel | null;
}

export const useUserStore = defineStore("user", {
	state: (): UserState => ({
		userInfo: null,
	}),
	actions: {
		async fetchUserInfo() {
			try {
				const response = await playerService.getUser();
				this.setUserInfo(response.data.data);
				this.socketConnect();
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
		removeLocalStorage() {
			this.userInfo = null;

			localStorage.removeItem("user");
		},
		socketConnect() {
			if (socket.connected) return;
			const userInfo = this.userInfo;

			socket.auth = { userInfo };

			socket.connect();

			socket.on("connect", () => {
				socket.emit("register", {
					user_id: this.userInfo?.getUserId(),
				});
			});

			socket.on("disconnect", (reason) => {
				console.warn("Desconectado del Socket", reason);
			});
		},
	},
	getters: {
		getUserInfo: (state) => state.userInfo,
	},
});
