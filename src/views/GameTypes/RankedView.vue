<template>
	<v-container fluid>
		<v-row>
			<v-col cols="12">
				<OnlineInformation />
			</v-col>
		</v-row>
		<v-row>
			<v-col sm="12" md="5" cols="12">
				<QueueBox :game-type="getPathGame" />
			</v-col>

			<v-col md="7" sm="12">
				<ChatBox :game-type="getPathGame" :get-is-supporting="userInfo?.getIsSupporting()" />
			</v-col>
		</v-row>
		<!---------------------------------------------->
		<!---------------- GAME STARTED ---------------->
		<!---------------------------------------------->
		<!--<v-row v-if="gameStarted">
      <v-col
          sm="8"
          md="8"
          cols="12"
      >
        <chat
            title="Pug Match"
            :send-message="sendMessage"
            :text="textSecond"
            v-model="textSecond"
            :messages="messagesSecond"

        />
      </v-col>-->

		<!--------------------------------------------------->
		<!--------------- CURRENT GAMES --------------->
		<!--------------------------------------------------->
		<!-- <v-row>
			<v-col sm="12" md="3" lg="3" cols="12">
				<online-users />
			</v-col>
			<v-col md="9" cols="12">
				<current-games :user-info="userInfo" />
			</v-col>
		</v-row> -->

		<!------------------------------------------>
		<!----------------- DIALOG ----------------->
		<!------------------------------------------>
		<!-- <Dialog
			:dialog="dialog"
			@start-game="startGame"
			:time="timeRemaining"
		/> -->

		<!-- <GameStarted
			:game-object="gameObject"
			:is-game-started="isGameStarted"
			@close-game-dialog="closeGameDialog"
		/> -->
		<!-------------------------------------------->
		<!----------------- SNACKBAR ----------------->
		<!-------------------------------------------->
		<!-- <snackbar :snackbar-obj="snackbarObj" /> -->
	</v-container>
	<BottomNavigation :game-type="getPathGame" />
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, onUnmounted } from "vue";

import OnlineInformation from "@/components/Cards/OnlineInformation.vue";
import QueueBox from "@/components/Cards/QueueBox.vue";
import ChatBox from "@/components/Cards/ChatBox.vue";
import BottomNavigation from "@/components/Cards/BottomNavigation.vue";

/* import PlayerItemModel from "@/models/Player/PlayerItemModel";
import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";
import SnackBarClass from "@/models/Extra/SnackBarClass"; */

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";
import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const socketInstance = useSocket();

const getPathGame = ref<number>(2);

const isGameStarted = ref<boolean>(false);

const activate = ref(true);

const gameObject = ref<QueueGamesItemModel | null>(null);

const startGame = () => {
	/* dialog.value = false;
	socketInstance.emit("accept:game", {
		userid: userInfo?.getUserId(),
		room: getPathGame.value,
	}); */
};

const closeGameDialog = () => {
	isGameStarted.value = !isGameStarted.value;
};

const socketEvent = () => {
	socketInstance.emit("room:join-room", getPathGame.value);

	/* socketInstance.on("player:left", (userId: number) => {
				if (userId === userInfo?.getUserId()) {
					timeRemaining.value = 30;
					const audio = new Audio(
						require("@/assets/audio/menu_countdown.wav"),
					);
					audio.volume = 0.1;
					audio.play();
				}
			});

			socketInstance.on("accept:game", (userId: number, region: number) => {
				const setQueueStatus = (queue: QueueItemModel[], userId: number) => {
					const item = queue.find((q) => q.getUserId() === userId);

					if (item) {
						timeRemaining.value = 30;
						item.setIsJoined(2);
						joinedQueueN.value = true;
					}
				};

				const queue = queueMap.getQueue()[region - 1]?.getQueue();
				queue && setQueueStatus(queue, userId);
			});

			socketInstance.on("drop:players", (region: number) => {
				const queue = queueMap.value[region];

				queue.getQueue().forEach((q: QueueItemModel) => {
					if (q.getUserId() == userInfo?.getUserId()) {
						const audio = new Audio(
							require("@/assets/audio/critical_event_1.wav"),
						);
						audio.volume = 0.2;
						audio.play();
						timeRemaining.value = 30;
						joinedQueueN.value = false;
					}
				});

				queue.getQueue().splice(0, queue.getQueue().length);

				if (queue.getQueue() !== 8) getRankedQueue();
			});

			socketInstance.on("current:games", (message: IQueueGames) => {
				JSON.parse(message.teamA).forEach((player: PlayerItemModel) => {
					if (player.UserID === userInfo?.getUserId()) {
						isGameStarted.value = true;
						gameObject.value = new QueueGamesItemModel(message);
					}
				});

				JSON.parse(message.teamB).forEach((player: any) => {
					if (player.UserID === userInfo?.getUserId()) {
						isGameStarted.value = true;
						gameObject.value = new QueueGamesItemModel(message);
					}
				});
			}); */
};

onBeforeMount(() => {
	socketEvent();
});

onUnmounted(() => {
	socketInstance.emit("room:leave-room", getPathGame.value);
});

/* Snackbar subir a otro nivel
const snackbarObj: Ref<SnackBarClass | null> = ref(null); */
</script>
<style scoped></style>
