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
			const userInfo = {
				UserID: 1,
				avatarfull:
					"https://avatars.steamstatic.com/4966a98375f5691fd8a35ae841446beb0596d678_full.jpg",
				colorChat: "#FFFFFF",
				glowColor: "#FFFFFF",
				Rating: 1500,
				GamesPlayed: 5,
				LastGame: "Today",
				Wins: 5,
				personaname: "็blake_ ",
				SteamID64: 76561198011671551,
				profileurl: "https://steamcommunity.com/id/blakewasd/",
				personastate: 1,
				Rol: 2,
				created_at: "2009-07-07 23:32:51.000",
				IsPremium: 0,
				timecreated: "2009-07-07 23:32:51.000",
			};

			this.userInfo = new UserItemModel(userInfo);
			try {
				/* const getUser = localStorage.getItem("user");

				if (!getUser) {
					const { data } = await playerService.getUser();
					console.log(data);
					//@ts-ignore
					this.setUserInfo(data);
				} else {
					this.setUserInfo(getUser);
				}

				if (socket.connected) return;

				socket.connect(); */

				/* socket.on('connect', () => {
                    socket.emit('register', {
                        user_id: this.userInfo?.getUserId()
                    });
                    socket.emit('forGateway', {
                        action: 'subscribe',
                        data: {
                            service: 'steam-bot',
                            types: ['!' + this.userInfo?.getUserId()]
                        }
                    });

                    socket.emit('forGateway', {
                        action: 'subscribe',
                        data: {
                            service: 'app-events',
                            types: ['!' + this.userInfo?.getUserId()]
                        }
                    });

                    if (this.userInfo?.getUserRol() == 3) {
                        socket.emit('forGateway', {
                            action: 'subscribe',
                            data: {
                                service: 'steam-bot',
                                types: ['!admin']
                            }
                        });
                    }
                }); */

				socket.on("steam-bot:subscribe-result", function (info) {
					console.log("steam-bot:subscribe-result");
					console.log(info);
				});

				socket.on("app-events:subscribe-result", function (info) {
					console.log("app-events:subscribe-result");
					console.log(info);
				});

				socket.on("disconnect", (reason) => {
					console.warn("Desconectado del Socket", reason);
				});
			} catch (error) {
				this.setUserInfoNull();
			}
		},
		setUserInfo(data: any) {
			this.userInfo = new UserItemModel(data);
			localStorage.setItem("user", data);
		},
		setUserInfoNull() {
			this.userInfo = null;

			localStorage.removeItem("buyer_items");
			localStorage.removeItem("seller_items");
			localStorage.removeItem("user");
		},
	},
	getters: {
		getUserInfo: (state) => state.userInfo,
	},
});
