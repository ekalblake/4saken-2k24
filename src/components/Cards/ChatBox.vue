<template>
	<v-container class="bgc_cards">
		<v-card class="bgc_cards text-white overflow-auto" height="700px">
			<div v-if="!messageList" class="progressbar_center">
				<v-progress-circular indeterminate color="primary" />
			</div>
			<v-list v-else class="bg-transparent">
				<v-list-item
					v-for="(message, i) in messageList.getChats()"
					:key="i"
				>
					<template v-slot:prepend>
						<v-avatar
							@click="openProfile(message.getProfileURL())"
							class="rounded-lg cursor-pointer"
							:style="
								'box-shadow: 0px 0px 5px' +
								message.getColorChat() +
								';'
							"
						>
							<v-img :src="message.getAvatarFull()" />
						</v-avatar>
					</template>
					<template v-slot:default>
						<span
							class="overflow-auto"
							:style="{
								color: message.getColorChat(),
								textShadow:
									'0 0 10px ' + message.getGlowColor(),
								fontWeight: 'bold',
							}"
						>
							{{ message.getPersonaName() }} </span
						>:
						<span
							v-if="message.getIsSupporting()"
							:style="{
								color: 'navy',
								textShadow: 'rgb(255 0 0) 0px 0px 10px',
								fontWeight: 'bold',
							}"
							>{{ message.getMessageChat() }}
						</span>
						<span v-else>{{ message.getMessageChat() }} </span>
					</template>
				</v-list-item>
			</v-list>
		</v-card>
		<v-card class="bgc_cards text-white overflow-auto my-3">
			<v-card-text v-if="userTyping != ''">
				<p>{{ userTyping }}</p>
			</v-card-text>
			<v-card-text>
				<v-text-field
					label="Envia un mensaje aquí"
					v-model="chatText"
					@keydown.enter.prevent="addMessage"
					counter
					maxlength="150"
				>
					<template v-slot:append-inner>
						<v-btn
							class="rounded-lg"
							variant="plain"
							size="x-small"
							icon="mdi-send"
							@click="$emit('send-message')"
						>
						</v-btn>
					</template>
					<template v-slot:append>
						<v-menu location="left" :close-on-content-click="false">
							<template v-slot:activator="{ props }">
								<v-btn
									class="rounded-lg"
									size="x-small"
									icon
									v-bind="props"
								>
									<v-icon> mdi-emoticon </v-icon>
								</v-btn>
							</template>
							<EmojiPicker @select="insertEmoji" />
						</v-menu>
					</template>
				</v-text-field>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";

import EmojiPicker from "vue3-emoji-picker";

import "vue3-emoji-picker/css";

import useSocket from "@/composables/useSocket";
import { useUserStore } from "@/store/userStore";

import ChatModel from "@/models/Chat/ChatModel";
import ChatItemModel from "@/models/Chat/ChatItemModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

const props = defineProps<{
	text: string;
	title: string;
	getRol: number | undefined;
	getIsSupporting: boolean | undefined;
	gameType: number;
}>();

const socketInstance = useSocket();

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo as PlayerItemModel | null);

const userTyping = ref<string>("");

const chatText = ref<string>("");

const messageList = ref<ChatModel | null>(null);

/* const rules = ref({
	counter: (value: any) => value.length <= 150 || "Max 150 characters",
}); */

const openProfile = (link: string) => {
	window.open(link);
};

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
		message_body: chatText.value,
		room: getPathGame.value,
		created_at: Math.floor(Date.now() / 1000),
	};
	if (!chatText.value) return;

	chatText.value = "";

	/* const response = await chatService.sendMessage(message);

	if (response.status) {
		snackbarObj.value = new SnackBarClass(response);
		snackbarObj.value.setSnackbar(
			response.data.msg,
			"red",
			true,
			response.status,
		);
	} else {
		socketInstance.emit("message:chat", {
			message,
			room: getPathGame.value,
		});
	} */
};

//Insert Emoji
const insertEmoji = (emoji: any) => {
	chatText.value += emoji.data;
};

//Delete message as Admin
const deleteMessageAsAdmin = async (chatId: number) => {
	const response = await chatService.deleteMessageAsAdmin(chatId);

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
			chatId,
			room: props.gameType,
		});
	}
};

//User is typing
watch(chatText, () => {
	if (chatText.value != "") {
		socketInstance.emit("user:typing", {
			user: userInfo?.getPersonaName(),
			room: props.gameType,
		});
	}
});

//Get Messages
const getMessages = async () => {
	/* const response = await chatService.getMessageUnranked(2); */

	const response: any = [
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 2,
			message_body: "Another message",
			room: 123,
			created_at: "2024-08-23T12:35:56Z",
			avatarfull: "https://example.com/avatar2.jpg",
			personaname: "User456",
			profileurl: "https://example.com/profile2",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 0,
			pug_Rating: 1300,
			pug_GamesPlayed: 600,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 350,
			duel_Rating: 1150,
			duel_GamesPlayed: 250,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 140,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
		{
			chatid: 1,
			message_body:
				"Hello world!, soy un mensaje largo hola de prueba texto texto sessssasdaasd",
			room: 123,
			created_at: "2024-08-23T12:34:56Z",
			avatarfull: "https://example.com/avatar1.jpg",
			personaname: "User123",
			profileurl: "https://example.com/profile1",
			colorChat: "#FF5733",
			glowColor: "#FFFF00",
			Rol: 2,
			IsPremium: 1,
			pug_Rating: 1200,
			pug_GamesPlayed: 500,
			pug_LastGame: "2024-08-22T18:30:00Z",
			pug_Wins: 300,
			duel_Rating: 1100,
			duel_GamesPlayed: 200,
			duel_LastGame: "2024-08-22T17:00:00Z",
			duel_Wins: 120,
		},
	];

	messageList.value = new ChatModel(response);
};

const socketEvents = () => {
	socketInstance.on("message:chat", (message: ChatItemModel) => {
		const messageConstructor = new ChatItemModel(message);

		messageList.value?.getChats().push(messageConstructor);

		if (chatText.value == "") userTyping.value = "";

		userTyping.value = "";
	});

	socketInstance.on("delete:message:admin", (chatid: number) => {
		let removeIndex = messageList.value
			?.getChats()
			.map((item: ChatItemModel) => {
				return item.getChatId();
			})
			.indexOf(chatid);

		if (removeIndex !== -1)
			messageList.value?.getChats().splice(removeIndex!, 1);
	});

	socketInstance.on("user:typing", (userName: string) => {
		if (chatText.value == "") {
			userTyping.value = "";
		} else {
			userTyping.value = userName + " está escribiendo..";
		}
	});
};

watch(userTyping, () => {
	setTimeout(() => {
		userTyping.value = "";
	}, 3000);
});

onMounted(() => {
	getMessages();
	socketEvents();
});
</script>

<style scoped>
.progressbar_center {
	min-height: 650px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
