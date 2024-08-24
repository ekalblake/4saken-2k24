<template>
	<v-container fluid color="transparent">
		<v-row>
			<online-info :user-info="userInfo" />
		</v-row>
		<v-row>
			<!--------------------------->
			<!---------- QUEUE ---------->
			<!--------------------------->

			<v-col sm="12" md="5" cols="12">
				<QueueBox
					:queue-list="queueScout"
					:joined-queue="joinedQueueN"
					:is-disabled="isDisabled"
					:get-rol="getRol"
					:region="1"
					:get-is-premium="getIsPremium"
					@drop-queue="dropQueue(1)"
					@join-queue="addQueue(1)"
				/>
			</v-col>

			<v-col md="7" sm="12">
				<ChatBox
					title="Ranked Chat"
					:game-type="getPathGame"
					:get-rol="getRol"
					:insert-emoji="insertEmoji"
					:get-is-supporting="userInfo?.getIsSupporting()"
					@send-message="addMessage"
					@delete-message="deleteMessageAsAdmin"
				/>
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
		</v-row>
 -->
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
import {
	ref,
	defineComponent,
	computed,
	watch,
	onBeforeMount,
	Ref,
	onUnmounted,
	onMounted,
	PropType,
} from "vue";

import onlineInfo from "@/components/Cards/OnlineInfo.vue";
import QueueBox from "@/components/Cards/QueueBox.vue";
import ChatBox from "@/components/Cards/ChatBox.vue";
/* import onlineUsers from "@/components/cards/OnlineUsersBox.vue"; */
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

export default defineComponent({
	name: "SoloView",
	components: {
		onlineInfo,
		QueueBox,
		ChatBox,
		/* onlineUsers
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

		const getRol: Ref<number | undefined> = computed(() =>
			userInfo?.getRol(),
		);
		const getIsPremium: Ref<number | undefined> = computed(() =>
			userInfo?.getIsPremium(),
		);

		//Se configura despues de verificar si está.
		const joinedQueueN = ref<boolean>(false);
		const isDisabled = ref<boolean>(false);

		const gameStarted: Ref<boolean> = ref(false);

		const dialog: Ref<boolean> = ref(false);
		const timeRemaining: Ref<number> = ref(30);
		const isGameStarted: Ref<boolean> = ref(false);
		const gameObject: Ref<QueueGamesItemModel | null> = ref(null);

		const intervalQueue: any = ref(null);

		//Snackbar
		const snackbarObj: Ref<SnackBarClass | null> = ref(null);

		const getPathGame = ref<number>(2);

		//SOCKET IO CLIENT
		const socketIo = () => {
			//Unirse al ROOM
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

			socketInstance.on(
				"drop:queue",
				(userId: number, region: number) => {
					const queue = queueMap.value[region];

					//Borrar al jugador de la cola.
					let removeIndex = queue
						.getQueue()
						.map((item: QueueItemModel) => item.getUserId())
						.indexOf(userId);

					queue.getQueue().splice(removeIndex!, 1);

					//Verificar el usuario kickeado para que desactive el boton.
					if (userId === userInfo?.getUserId())
						joinedQueueN.value = false;

					queue.getQueue().forEach((q: QueueItemModel) => {
						//Todos tienen que ver el cambio de estado
						q.setIsJoined(1);

						if (q.getUserId() === userInfo?.getUserId()) {
							//Solamente se cierra el dialog a los que estan en la cola + El tiempo se reinicia para todos ellos
							timeRemaining.value = 30;
							dialog.value = false;
						}
					});

					/* if(queue.getQueue().length != 8) getRankedQueue() */
				},
			);

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

			socketInstance.on(
				"accept:game",
				(userId: number, region: number) => {
					const setQueueStatus = (
						queue: QueueItemModel[],
						userId: number,
					) => {
						const item = queue.find(
							(q) => q.getUserId() === userId,
						);

						if (item) {
							timeRemaining.value = 30;
							item.setIsJoined(2);
							joinedQueueN.value = true;
						}
					};

					const queue = queueMap.getQueue()[region - 1]?.getQueue();
					queue && setQueueStatus(queue, userId);
				},
			);

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

		/**
		 * ADD QUEUE
		 */
		const addQueue = async (region: number) => {
			isDisabled.value = true;

			const userQueue = {
				userid: userInfo?.getUserId(),
				region,
			};

			const response = await queuesService.joinQueue(userQueue);

			if (response.status) {
				snackbarObj.value = new SnackBarClass(response);
				snackbarObj.value.setSnackbar(
					response.data.msg,
					"red",
					true,
					response.status,
				);
			} else {
				joinedQueueN.value = true;
				socketInstance.emit("join:queue", {
					region,
					room: getPathGame.value,
				});
			}

			isDisabled.value = false;
		};

		/**
		 * DROP QUEUE
		 */
		const dropQueue = async (region: number) => {
			isDisabled.value = true;

			const dropQueue = await queuesService.dropQueue(region);

			if (dropQueue.status) {
				snackbarObj.value = new SnackBarClass(dropQueue);
				snackbarObj.value.setSnackbar(
					dropQueue.data.msg,
					"red",
					true,
					dropQueue.status,
				);
			} else {
				joinedQueueN.value = false;
				isDisabled.value = false;

				/* queue?.getQueue().forEach(() => {
					dialog.value = false;
					timeRemaining.value = 30;
				}); */

				socketInstance.emit("drop:queue", {
					userid: userInfo?.getUserId(),
					region,
					room: getPathGame.value,
				});
			}
		};

		const dropAdmin = async (userid: number, region: number) => {
			const dropQueueAdmin = await queuesService.dropQueueAdmin(userid);

			if (dropQueueAdmin.status) {
				snackbarObj.value = new SnackBarClass(dropQueueAdmin);
				snackbarObj.value.setSnackbar(
					dropQueueAdmin.data.msg,
					"red",
					true,
					dropQueueAdmin.status,
				);
			} else {
				dialog.value = false;
				isDisabled.value = false;

				/* queue.getQueue().forEach((q: QueueItemModel) => {
					q.setIsJoined(1);
				}); */

				socketInstance.emit("drop:queue", userid, region);
			}
		};

		/**************************************
		 * QUEUE AFTER 8 PLAYERS ARE READY
		 **************************************
		 **/

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

		//Accept dialog
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

		watch(queueScout, () => {
			checkQueue(queueScout.value);
		});

		watch(queueAdept, () => {
			checkQueue(queueAdept.value);
		});

		watch(queueVeteran, () => {
			checkQueue(queueVeteran.value);
		});

		async function getRankedQueue() {
			if (
				queueScout.value?.getQueue().length == 8 ||
				queueAdept.value?.getQueue().length == 8 ||
				queueVeteran.value?.getQueue().length == 8
			)
				return;

			const queueMock: any = [
				{
					UserID: 1,
					SteamID64: "76561198000000001",
					queueid: 101,
					isjoined: true,
					region: 1,
					joined_date: "2024-08-23T14:00:00Z",
					avatarfull: "http://example.com/avatar1.png",
					personaname: "PlayerOne",
					profileurl: "http://example.com/profile/1",
					colorChat: "#FF0000",
					glowColor: "#00FF00",
					created_at: "2024-01-01T00:00:00Z",
					personastate: 1,
					timecreated: "2024-01-01T00:00:00Z",
					Rol: 2,
					IsPremium: 1,
					Rating: 1500,
					GamesPlayed: 100,
					LastGame: "2024-08-22",
					Wins: 50,
					duel_mmr_Rating: 1600,
					duel_mmr_GamesPlayed: 50,
					duel_mmr_LastGame: "2024-08-21",
					duel_mmr_Wins: 25,
				},
				{
					UserID: 2,
					SteamID64: "76561198000000002",
					queueid: 102,
					isjoined: false,
					region: 2,
					joined_date: "2024-08-23T15:00:00Z",
					avatarfull: "http://example.com/avatar2.png",
					personaname: "PlayerTwo",
					profileurl: "http://example.com/profile/2",
					colorChat: "#00FF00",
					glowColor: "#FF0000",
					created_at: "2024-01-02T00:00:00Z",
					personastate: 2,
					timecreated: "2024-01-02T00:00:00Z",
					Rol: 1,
					IsPremium: 0,
					Rating: 1400,
					GamesPlayed: 80,
					LastGame: "2024-08-21",
					Wins: 40,
					duel_mmr_Rating: 1500,
					duel_mmr_GamesPlayed: 40,
					duel_mmr_LastGame: "2024-08-20",
					duel_mmr_Wins: 20,
				},
			];
			queueScout.value = new QueueModel(queueMock);

			/* const queueResponse: any = await queuesService.getQueueStatus();

			queueScout.value = new QueueModel(queueResponse[0]);
			queueAdept.value = new QueueModel(queueResponse[1]);
			queueVeteran.value = new QueueModel(queueResponse[2]);

			for (let i = 0; i < queueResponse.length; i++) {
				let queueList = new QueueModel(queueResponse[i]);

				let findUserID = queueList
					?.getQueue()
					.map((queue: QueueItemModel) => {
						return queue.getUserId();
					});

				for (let j = 0; j < findUserID.length; j++) {
					let userID = findUserID[j];
					if (userID === userInfo?.getUserId()) {
						joinedQueueN.value = true;
					}
				}
			}

			intervalQueue.value = setTimeout(() => {
				getRankedQueue();
			}, 1500); */
		}

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

		//Send Message

		onMounted(() => {
			getRankedQueue();
		});

		onBeforeMount(() => {
			socketIo();
		});

		onUnmounted(() => {
			clearTimeout(intervalQueue.value);

			socketInstance.emit("onunmounted:room", getPathGame.value);

			queueScout.value?.getQueue().forEach(async (q: QueueItemModel) => {
				if (q.getUserId() == userInfo?.getUserId()) await dropQueue(1);
			});
			queueAdept.value?.getQueue().forEach(async (q: QueueItemModel) => {
				if (q.getUserId() == userInfo?.getUserId()) await dropQueue(2);
			});
			queueVeteran.value
				?.getQueue()
				.forEach(async (q: QueueItemModel) => {
					if (q.getUserId() == userInfo?.getUserId())
						await dropQueue(3);
				});
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

			//Funciones
			addQueue,
			dropQueue,
			startGame,
			dropAdmin,
			closeGameDialog,
		};
	},
});
</script>
<style scoped></style>
