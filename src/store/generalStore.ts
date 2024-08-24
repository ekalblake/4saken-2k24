import { defineStore } from "pinia";

import { GameID, GameLink } from "../constants/constants";

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
