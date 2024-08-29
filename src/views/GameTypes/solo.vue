<template>
	<v-container fluid color="transparent">
		<!-------------------------->
		<!----STATUS INFORMATION---->
		<!-------------------------->
		<v-row>
			<online-info :user-info="userInfo" />
		</v-row>

		<!-------------------------->
		<!---- QUEUE INFORMATION---->
		<!-------------------------->
		<v-row>
			<!--------------------------->
			<!---------- QUEUE ---------->
			<!--------------------------->
			<v-col sm="12" md="6" lg="3">
				<queue-table
					:region="4"
					:queue-info="{
						img: 'puggg.png',
						alt: 'Solo',
						type: 'Solo',
					}"
					:queues="queueUnranked"
					:joined-queue="joinedQueueN"
					:is-disabled="isDisabled"
					:get-rol="getRol"
					:get-is-premium="getIsPremium"
					@drop-queue="dropQueue(4, queueUnranked)"
					@join-queue="addQueue(4, queueUnranked)"
					@drop-admin="dropAdmin"
				/>
			</v-col>

			<!-------------------------->
			<!---------- CHAT ---------->
			<!-------------------------->
			<v-col lg="6" md="6" sm="12">
				<chat
					title="Unranked Chat"
					:messages="messages"
					v-model="text"
					:text="text"
					:get-rol="getRol"
					:user-typing="userTyping"
					:insert-emoji="insertEmoji"
					@send-message="addMessage()"
					@delete-message="deleteMessageAsAdmin"
				/>
			</v-col>

			<!---------------------------------------------->
			<!--------------- ONLINE PLAYERS --------------->
			<!---------------------------------------------->
			<v-col sm="12" md="12" lg="3" cols="12">
				<online-users />
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

		<!---------------------------------------------->
		<!--------------- ONLINE PLAYERS --------------->
		<!---------------------------------------------->
		<!--<v-col
        sm="4"
        md="4"
        cols="12"
    >
      <online-users class="d-md-none" title="Match" :online-players="onlinePlayers"/>
    </v-col>
  </v-row>-->

		<!--------------------------------------------------->
		<!--------------- CURRENT GAMES --------------->
		<!--------------------------------------------------->
		<v-row>
			<v-col md="12">
				<current-games :user-info="userInfo" />
			</v-col>
		</v-row>

		<!------------------------------------------>
		<!----------------- DIALOG ----------------->
		<!------------------------------------------>
		<Dialog
			:dialog="dialog"
			@start-game="startGame"
			:time="timeRemaining"
		/>

		<GameStarted
			:game-object="gameObject"
			:is-game-started="isGameStarted"
		/>
		<!-------------------------------------------->
		<!----------------- SNACKBAR ----------------->
		<!-------------------------------------------->
		<snackbar :snackbar-obj="snackbarObj" />
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
	reactive,
	onUnmounted,
	onMounted,
	PropType,
	getCurrentInstance,
	watchEffect,
} from "vue";

import onlineInfo from "../../components/Cards/OnlineInformation.vue";
import queueTable from "../../components/cards/QueueBox.vue";
import onlineUsers from "@/components/cards/OnlineUsersBox.vue";
import Dialog from "@/components/cards/Dialog/MatchFoundDialog.vue";
import Snackbar from "@/components/cards/Snackbar/Snackbar.vue";
import chat from "../../components/cards/ChatBox.vue";
import currentGames from "@/components/cards/CurrentGamesBox.vue";
import GameStarted from "@/components/cards/Dialog/GameStarted.vue";

import IQueue from "@/interface/Queue/IQueue";

/**
 * MODELS
 */
import QueueItemModel from "@/models/Queues/QueueItemModel";
import ChatItemModel from "@/models/Chat/ChatItemModel";
import ChatModel from "@/models/Chat/ChatModel";
import QueueModel from "@/models/Queues/QueueModel";
import queueItemModel from "@/models/Queues/QueueItemModel";

/**
 * SERVICES
 */
import socketInstance from "@/services/socket";
import { queuesService } from "@/services/Queues/QueuesService";
import { chatService } from "@/services/Chat/ChatService";
import PlayerItemModel from "@/models/Players/PlayerItemModel";
import IQueueGames from "@/interface/Queue/IQueueGames";
import QueueGamesItemModel from "@/models/Queues/QueueGamesItemModel";
import SnackBarClass from "@/models/Extra/SnackBarClass";

export default defineComponent({
	name: "SoloView",
	components: {
		onlineInfo,
		queueTable,
		chat,
		onlineUsers,
		Dialog,
		Snackbar,
		currentGames,
		GameStarted,
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

		const text = ref<string>("");

		//Mensajes del chat principal
		const messages: Ref<ChatModel | null> = ref(null);

		// Usuario escribiendo...
		const userTyping = ref<string>("");

		/******************************************************************************************************************
		 * VARIABLES DE QUEUE
		 ******************************************************************************************************************/

		const queueUnranked: Ref<QueueModel | null> = ref(null);

		const getRol: Ref<number | undefined> = computed(() =>
			userInfo?.getRol(),
		);
		const getIsPremium: Ref<number | undefined> = computed(() =>
			userInfo?.getIsPremium(),
		);

		//Se configura despues de verificar si está.
		const joinedQueueN = ref<boolean>(false);
		const isDisabled = ref<boolean>(false);

		const joinedQueueA = ref<boolean>(false);
		const isDisabledA = ref<boolean>(false);

		const joinedQueueV = ref<boolean>(false);
		const isDisabledV = ref<boolean>(false);

		const gameStarted: Ref<boolean> = ref(false);

		const dialog: Ref<boolean> = ref(false);
		const timeRemaining: Ref<number> = ref(30);
		const isGameStarted: Ref<boolean> = ref(false);
		const gameObject: Ref<QueueGamesItemModel | null> = ref(null);

		//Snackbar
		let snackbarObj: Ref<SnackBarClass | null> = ref(null);

		const getPathGame = ref<number>(1);

		//SOCKET IO CLIENT
		const socketIo = () => {
			//Unirse al ROOM
			socketInstance.emit("join:room", getPathGame.value);
			/***************************************************************************************************************
			 *                                                SOCKET.IO
			 **************************************************************************************************************/

			/************************************************************************************************************
			 * join:queue : Add Unranked Queue
			 * drop:queue : Finds steamID and remove Drop Queue
			 * player:left : emits a sound when a player left the queue
			 * accept:game : Update the status of the current player in the Queue
			 * drop:players : Drops all players from queue
			 ***********************************************************************************************************/
			socketInstance.on("join:queue", (QueueUserJoined: IQueue) => {
				if (
					!queueUnranked.value?.getQueue() ||
					queueUnranked.value?.getQueue().length === 8
				)
					return;

				queueUnranked.value
					?.getQueue()
					.push(new QueueItemModel(QueueUserJoined));
			});

			socketInstance.on("drop:queue", (userid: number) => {
				//Borrar al jugador de la cola.
				let removeIndex = queueUnranked.value
					?.getQueue()
					.map((item: QueueItemModel) => item.getUserId())
					.indexOf(userid);

				queueUnranked.value?.getQueue().splice(removeIndex!, 1);

				//Verificar el usuario kickeado para que desactive el boton.
				if (userid === userInfo?.getUserId())
					joinedQueueN.value = false;

				queueUnranked.value?.getQueue().forEach((q: QueueItemModel) => {
					//Todos tienen que ver el cambio de estado
					q.setIsJoined(1);

					if (q.getUserId() === userInfo?.getUserId()) {
						//Solamente se cierra el dialog a los que estan en la cola + El tiempo se reinicia para todos
						timeRemaining.value = 30;
						dialog.value = false;
					}
				});
			});

			socketInstance.on("player:left", (userid: number) => {
				if (userid === userInfo?.getUserId()) {
					const audio = new Audio(
						require("@/assets/audio/menu_countdown.wav"),
					);
					audio.volume = 0.1;
					audio.play();
				}
			});

			socketInstance.on("accept:game", (userid: number) => {
				queueUnranked.value?.getQueue().forEach((q: QueueItemModel) => {
					if (q.getUserId() == userid) {
						q.setIsJoined(2);
						joinedQueueN.value = true;
					}
				});
			});

			socketInstance.on("drop:players", () => {
				queueUnranked.value?.getQueue().forEach((q: QueueItemModel) => {
					if (q.getUserId() === userInfo?.getUserId()) {
						const audio = new Audio(
							require("@/assets/audio/critical_event_1.wav"),
						);
						audio.volume = 0.2;
						audio.play();
						timeRemaining.value = 30;
						joinedQueueN.value = false;
					}
				});

				queueUnranked.value
					?.getQueue()
					.splice(0, queueUnranked.value?.getQueue().length);
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
			 * message:received : Displays and pushes the message sent by user + everybody watches live event
			 * delete:message : After an admin deletes the message everybody can see how the message was deleted
			 * user:typing : If someone is typing the name will be displayed for the rest
			 ***********************************************************************************************************/
			socketInstance.on("message:chat", (message: ChatItemModel) => {
				messages.value?.getChats().push(new ChatItemModel(message));

				if (text.value == "") userTyping.value = "";

				userTyping.value = "";
			});

			socketInstance.on("delete:message:admin", (chatid: number) => {
				let removeIndex = messages.value
					?.getChats()
					.map((item: ChatItemModel) => {
						return item.getChatId();
					})
					.indexOf(chatid);

				if (removeIndex !== -1)
					messages.value?.getChats().splice(removeIndex!, 1);
			});

			socketInstance.on("user:typing", (userName: string) => {
				if (text.value == null) {
					userTyping.value = "";
				} else {
					userTyping.value = userName + " está escribiendo..";
				}
			});
		};

		/************************************************************************************************************
		 * QUEUE
		 * GET QUEUE -> Queue List
		 * ADD QUEUE -> Joins Queue + Disable join button
		 * DROP QUEUE -> Drops Queue + Disable drop button + set to unready to all players
		 * DROP QUEUE : ADMIN -> Drops player from Queue as Admin
		 ***********************************************************************************************************/

		const getQueue = async () => {
			const resp = await queuesService.getQueues();

			queueUnranked.value = new QueueModel(resp[3]);

			let findUserID = queueUnranked.value
				?.getQueue()
				.map((queue: QueueItemModel) => {
					return queue.getUserId();
				});

			for (let i = 0; i < findUserID.length; i++) {
				let userID = findUserID[i];
				if (userID === userInfo?.getUserId()) {
					joinedQueueN.value = true;
				}
			}
		};

		//ADD QUEUE
		const addQueue = async (
			region: number,
			queueArray: QueueModel | null,
		) => {
			isDisabled.value = true;

			//Vaciar la cola
			queueArray?.getQueue().splice(0, queueArray?.getQueue().length);

			const userQueue = {
				userid: userInfo?.getUserId(),
				region: region,
			};

			//Actualizar la queue al momento de entrar la cola
			await getQueue();

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
		 * Closes Match found dialog.
		 */
		// const verifyDialog = () =>{
		//   console.log("test");
		//   acceptedMatch.value = false;
		// }

		//DROP QUEUE NOVICE
		const dropQueue = async (region: number, queue: QueueModel | null) => {
			isDisabled.value = true;

			const response = await queuesService.dropQueue(region);

			if (response.status) {
				snackbarObj.value = new SnackBarClass(response);
				snackbarObj.value.setSnackbar(
					response.data.msg,
					"red",
					true,
					response.status,
				);
			} else {
				joinedQueueN.value = false;

				queue?.getQueue().forEach(() => {
					dialog.value = false;
					timeRemaining.value = 30;
				});

				socketInstance.emit("drop:queue", {
					userid: userInfo?.getUserId(),
					region,
					room: getPathGame.value,
				});
			}

			isDisabled.value = false;
		};

		const dropAdmin = async (
			userid: number,
			region: number,
			queue: QueueModel,
		) => {
			const response = await queuesService.dropQueueAdmin(userid, region);

			if (response.status) {
				snackbarObj.value = new SnackBarClass(response);
				snackbarObj.value.setSnackbar(
					response.data.msg,
					"red",
					true,
					response.status,
				);
			} else {
				dialog.value = false;
				isDisabled.value = false;

				queue.getQueue().forEach((q: QueueItemModel) => {
					q.setIsJoined(1);
				});
				socketInstance.emit("drop:queue", {
					userid,
					region,
					room: getPathGame.value,
				});
			}
		};
		watchEffect(() => {
			if (queueUnranked.value?.getQueue().length === 8)
				startQueue(queueUnranked.value);
		});

		// 8 Players joined
		const startQueue = (queue: QueueModel) => {
			queue.getQueue().forEach((user: queueItemModel) => {
				if (user.getUserId() === userInfo?.getUserId()) {
					dialog.value = true;
					const audio = new Audio(
						require("@/assets/audio/helpful_event_1.wav"),
					);
					audio.play();

					/**
					 * Countdown
					 */
					let timerId = setInterval(countdown, 1000);

					async function countdown() {
						if (timeRemaining.value == 1) {
							timeRemaining.value = 30;
							dialog.value = false;
							clearTimeout(timerId);
						} else {
							timeRemaining.value--;
						}
					}
				}
			});
		};

		//Accept dialog
		const startGame = () => {
			dialog.value = false;
			socketInstance.emit("accept:game", {
				userid: userInfo?.getUserId(),
				room: getPathGame.value,
			});
		};

		/*******************************************************************************************************************
		 * MESSAGE EVENTS
		 * Get Messages through chatService.getMessage()
		 * Add Messages through
		 * Insert Emojis
		 * Delete Message as Admin
		 *******************************************************************************************************************/

		//Get Messages
		const getMessages = async () => {
			const response = await chatService.getMessageUnranked(1);

			messages.value = new ChatModel(response);
		};

		//Send Message
		const addMessage = async () => {
			const message: any = {
				userid: userInfo?.getUserId(),
				profileurl: userInfo?.getProfileURL(),
				ispremium: userInfo?.getIsPremium(),
				rating: userInfo?.getRating(),
				personastate: userInfo?.getCurrentStatus(),
				rol: userInfo?.getRol(),
				steamid: userInfo?.getSteamId(),
				colorChat: userInfo?.getColorChat(),
				glowColor: userInfo?.getGlowColor(),
				avatarfull: userInfo?.getAvatarFull(),
				personaname: userInfo?.getPersonaName(),
				timecreted: userInfo?.getTimeCreated(),
				message_body: text.value,
				room: getPathGame.value,
				created_at: new Date(),
			};
			if (!text.value) return;

			text.value = "";

			const response = await chatService.sendMessage(message);

			if (response.status) {
				snackbarObj.value = new SnackBarClass(response);
				snackbarObj.value.setSnackbar(
					response.data.msg,
					"red",
					true,
					response.status,
				);
			} else {
				messages.value?.getChats().push(new ChatItemModel(message));

				socketInstance.emit("message:chat", {
					message,
					room: getPathGame.value,
				});
			}
		};

		//Insert Emoji
		const insertEmoji = (emoji: any) => {
			text.value += emoji.data;
		};

		//Delete message as Admin
		const deleteMessageAsAdmin = async (chatid: number) => {
			const response = await chatService.deleteMessageAsAdmin(chatid);

			if (response.status) {
				snackbarObj.value = new SnackBarClass(response);
				snackbarObj.value.setSnackbar(
					response.data.msg,
					"red",
					true,
					response.status,
				);
			} else {
				socketInstance.emit("delete:message:admin", {
					chatid,
					room: getPathGame.value,
				});
			}
		};

		//User is typing
		watch(text, () => {
			if (text.value != "") {
				socketInstance.emit("user:typing", {
					user: userInfo?.getPersonaName(),
					room: getPathGame.value,
				});
			}
		});
		watch(userTyping, () => {
			setTimeout(() => {
				userTyping.value = "";
			}, 3000);
		});

		onBeforeMount(() => {
			getQueue();
			getMessages();
			socketIo();
		});

		onUnmounted(() => {
			socketInstance.emit("onunmounted:room", getPathGame.value);

			queueUnranked.value
				?.getQueue()
				.forEach(async (q: QueueItemModel) => {
					if (q.getUserId() == userInfo?.getUserId())
						await dropQueue(4, queueUnranked.value);
				});
		});

		return {
			//Messages
			messages,
			text,
			userTyping,
			insertEmoji,

			//Queue
			queueUnranked,
			joinedQueueN,
			isDisabled,

			joinedQueueA,
			isDisabledA,

			joinedQueueV,
			isDisabledV,

			//Extras
			dialog,
			snackbarObj,
			gameStarted,
			timeRemaining,
			getRol,
			getIsPremium,
			isGameStarted,
			gameObject,

			/*METHODS*/
			addQueue,
			addMessage,
			dropQueue,
			getQueue,
			startGame,
			dropAdmin,
			deleteMessageAsAdmin,
		};
	},
});
</script>
