<template>
	<v-container fluid color="transparent">
		<v-row>
			<OnlineInformation />
		</v-row>
		<v-row>
			<!--------------------------->
			<!---------- QUEUE ---------->
			<!--------------------------->

			<v-col sm="12" md="5" cols="12">
				<QueueBox :game-type="getPathGame" />
			</v-col>

			<v-col md="7" sm="12">
				<ChatBox :game-type="getPathGame" :get-rol="getRol" :get-is-supporting="userInfo?.getIsSupporting()" />
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
		<v-row>
			<v-col sm="12" md="3" lg="3" cols="12">
				<!-- <online-users /> -->
			</v-col>
			<v-col md="9" cols="12">
				<!-- <current-games :user-info="userInfo" /> -->
			</v-col>
		</v-row>

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
</template>

<script lang="ts">
import { ref, defineComponent, computed, watch, onBeforeMount, Ref, onUnmounted, onMounted, PropType } from "vue";

import OnlineInformation from "@/components/Cards/OnlineInformation.vue";
import QueueBox from "@/components/Cards/QueueBox.vue";
import ChatBox from "@/components/Cards/ChatBox.vue";
/* import Dialog from "@/components/cards/Dialog/MatchFoundDialog.vue";
import Snackbar from "@/components/cards/Snackbar/Snackbar.vue";
import currentGames from "@/components/cards/CurrentGamesBox.vue";
import GameStarted from "@/components/cards/Dialog/GameStarted.vue"; */

import QueueItemModel from "@/models/Queues/QueueItemModel";
import QueueModel from "@/models/Queues/QueueModel";

import ChatModel from "@/models/Chat/ChatModel";
import ChatItemModel from "@/models/Chat/ChatItemModel";

import PlayerItemModel from "@/models/Player/PlayerItemModel";
import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";
import SnackBarClass from "@/models/Extra/SnackBarClass";

import socketInstance from "@/services/socket";
import { queuesService } from "@/services/Queues/QueuesService";
import { chatService } from "@/services/Chat/ChatService";

import socket from "@/composables/useSocket";
import useSocket from "@/composables/useSocket";

export default defineComponent({
	name: "SoloView",
	components: {
		OnlineInformation,
		QueueBox,
		ChatBox,
		/*
		chat,
		Dialog,
		Snackbar,
		currentGames,
		GameStarted, */
	},
	props: {
		userInfo: {
			type: Object as PropType<PlayerItemModel>,
		},
	},
	setup(props) {
		const { userInfo } = props;

		const socket = useSocket();

		/******************************************************************************************************************
		 * VARIABLES DE CHAT
		 ******************************************************************************************************************/

		// Usuario escribiendo...

		/******************************************************************************************************************
		 * VARIABLES DE QUEUE
		 ******************************************************************************************************************/

		//Colas
		const queueScout: Ref<QueueModel | null> = ref(null);
		const queueAdept: Ref<QueueModel | null> = ref(null);
		const queueVeteran: Ref<QueueModel | null> = ref(null);

		const queueMap: any = ref({
			1: queueScout,
			2: queueAdept,
			3: queueVeteran,
		});

		const getRol: Ref<number | undefined> = computed(() => userInfo?.getRol());
		const getIsPremium: Ref<number | undefined> = computed(() => userInfo?.getIsPremium());

		//Se configura despues de verificar si está.
		const joinedQueueN = ref<boolean>(false);
		const isDisabled = ref<boolean>(false);

		const gameStarted: Ref<boolean> = ref(false);

		const dialog: Ref<boolean> = ref(false);
		const timeRemaining: Ref<number> = ref(30);
		const isGameStarted: Ref<boolean> = ref(false);
		const gameObject: Ref<QueueGamesItemModel | null> = ref(null);

		//Snackbar
		const snackbarObj: Ref<SnackBarClass | null> = ref(null);

		const getPathGame = ref<number>(2);

		//SOCKET IO CLIENT
		const socketIo = () => {
			//Unirse al ROOM
			socket.emit("room:join-room", getPathGame.value);
			socketInstance.emit("join:room", getPathGame.value);
			/***************************************************************************************************************
			 ***************************************************SOCKET.IO***************************************************
			 **************************************************************************************************************/

			/************************************************************************************************************
			 * join:queue : Add Ranked Queue
			 * drop:queue : Finds steamID and remove Drop Queue
			 * player:left : emits a sound when a player left the queue
			 * accept:game : Update the status of the current player in the Queue
			 * drop:players : Drops all players from queue
			 ***********************************************************************************************************/

			socketInstance.on("player:left", (userId: number) => {
				if (userId === userInfo?.getUserId()) {
					timeRemaining.value = 30;
					/* const audio = new Audio(
						require("@/assets/audio/menu_countdown.wav"),
					);
					audio.volume = 0.1;
					audio.play(); */
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
						/* const audio = new Audio(
							require("@/assets/audio/critical_event_1.wav"),
						);
						audio.volume = 0.2;
						audio.play(); */
						timeRemaining.value = 30;
						joinedQueueN.value = false;
					}
				});

				queue.getQueue().splice(0, queue.getQueue().length);

				/* if (queue.getQueue() !== 8) getRankedQueue(); */
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
			});
			/************************************************************************************************************
			 * SOCKET.IO : MESSAGES
			 * message:chat : Displays and pushes the message sent by user + everybody watches live event
			 * delete:message : After an admin deletes the message everybody can see how the message was deleted
			 * user:typing : If someone is typing the name will be displayed for the rest
			 ***********************************************************************************************************/
		};

		/************************************************************************************************************
		 * QUEUE
		 * ADD QUEUE -> Joins Queue + Disable join button
		 * DROP QUEUE -> Drops Queue + Disable drop button + set to unready to all players
		 * DROP QUEUE : ADMIN -> Drops player from Queue as Admin
		 ***********************************************************************************************************/

		// 8 Players joined
		const startQueue = () => {
			dialog.value = true;

			/* const audio = new Audio(
				require("@/assets/audio/helpful_event_1.wav"),
			);
			audio.play(); */

			//Countdown
			let timerId = setInterval(countdown, 1000);

			async function countdown() {
				if (timeRemaining.value === 1) {
					timeRemaining.value = 30;
					clearTimeout(timerId);
					dialog.value = false;
				} else {
					timeRemaining.value--;
				}
			}
		};

		const startGame = () => {
			dialog.value = false;
			socketInstance.emit("accept:game", {
				userid: userInfo?.getUserId(),
				room: getPathGame.value,
			});
		};

		const checkQueue = (queue: QueueModel | null) => {
			if (queue?.getQueue().length === 8) {
				queue?.getQueue().forEach((user: QueueItemModel) => {
					if (user.getUserId() === userInfo?.getUserId()) {
						startQueue();
					}
				});
			}
		};

		const closeGameDialog = () => {
			isGameStarted.value = !isGameStarted.value;
		};

		/*******************************************************************************************************************
		 * MESSAGE EVENTS
		 * Get Messages through chatService.getMessage()
		 * Add Messages through
		 * Insert Emojis
		 * Delete Message as Admin
		 *******************************************************************************************************************/

		onBeforeMount(() => {
			socketIo();
		});

		return {
			//Messages
			getPathGame,

			//Queue
			queueScout,
			queueAdept,
			queueVeteran,
			joinedQueueN,
			isDisabled,

			//Extras
			dialog,
			snackbarObj,
			gameStarted,
			timeRemaining,
			getRol,
			getIsPremium,
			isGameStarted,
			gameObject,

			startGame,
			closeGameDialog,
		};
	},
});
</script>
<style scoped></style>
