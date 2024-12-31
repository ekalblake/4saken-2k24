import { defineStore } from "pinia";

interface UserState {
	currentGameId: number;
}

export const useGeneralStore = defineStore("general", {
	state: (): UserState => ({
		currentGameId: 0,
	}),
	actions: {},
	getters: {},
});
