import { defineStore } from "pinia";
import { playerService } from "../services/Player/PlayerService";
import UserItemModel from "../models/Player/PlayerItemModel";
import useSocket from "../composables/useSocket";

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
				const getUser = localStorage.getItem("user");

				if (!getUser) {
					const response: any = await playerService.getUser();

					if (response.success == false) return;
					this.setUserInfo(response);
					this.socketConnect();
				} else {
					this.setLocalStorage(getUser);
					this.socketConnect();
				}
			} catch (error) {
				this.setUserInfoNull();
			}
		},
		setUserInfo(data: IPlayer) {
			this.userInfo = new UserItemModel(data);

			const parseObject = JSON.stringify(data);

			localStorage.setItem("user", parseObject);
		},
		setLocalStorage(data: string) {
			const parseUser: IPlayer = JSON.parse(data);
			this.userInfo = new UserItemModel(parseUser);
			localStorage.setItem("user", data);
		},
		setUserInfoNull() {
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
