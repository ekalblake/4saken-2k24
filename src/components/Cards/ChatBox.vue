<template>
	<v-card class="bgc_cards text-white overflow-auto" max-height="1000" max-width="650">
		<div v-if="isLoading" class="progressbar_center">
			<v-progress-circular indeterminate color="primary" />
		</div>
		<template v-else>
			<div ref="messageContainer">
				<v-list class="bg-transparent">
					<v-list-item v-for="(message, i) in messageList?.getChats()" :key="i">
						<template v-slot:prepend>
							<v-avatar
								@click="openProfile(message.getProfileURL())"
								class="rounded-lg cursor-pointer"
								:style="'box-shadow: 0px 0px 5px' + message.getColorChat() + ';'"
							>
								<v-img :src="message.getAvatarFull()" />
							</v-avatar>
						</template>
						<template v-slot:default>
							<span
								class="overflow-auto"
								:style="{
									color: message.getColorChat(),
									textShadow: '0 0 10px ' + message.getGlowColor(),
									fontWeight: 'bold',
								}"
							>
								{{ message.getPersonaName() }} </span
							>:
							<span
								v-if="userInfo?.getIsSupporting()"
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
			</div>
		</template>
	</v-card>
	<v-card class="bgc_cards text-white overflow-auto my-3" max-height="250" max-width="700">
		<v-card-text v-if="userTyping != ''">
			<p>{{ userTyping }}</p>
		</v-card-text>
		<v-card-text>
			<v-text-field
				hide-details
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
							<v-btn class="rounded-lg" size="x-small" icon v-bind="props">
								<v-icon> mdi-emoticon </v-icon>
							</v-btn>
						</template>
						<EmojiPicker @select="insertEmoji" />
					</v-menu>
				</template>
			</v-text-field>
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";

import EmojiPicker from "vue3-emoji-picker";

import "vue3-emoji-picker/css";

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";

import ChatModel from "@/models/Chat/ChatModel";
import ChatItemModel from "@/models/Chat/ChatItemModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import { chatService } from "@/services/Chat/ChatService";

const props = defineProps<{
	gameType: number;
}>();

const socketInstance = useSocket();

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const isLoading = ref<boolean>(true);

const userTyping = ref<string>("");

const chatText = ref<string>("");

const messageList = ref<ChatModel | null>(null);

const messageContainer = ref<HTMLElement | null>(null);

const openProfile = (link: string) => {
	window.open(link);
};

const addMessage = async () => {
	if (!chatText.value) return;

	const message: any = {
		userid: userInfo.value?.getUserId(),
		profileurl: userInfo.value?.getProfileURL(),
		ispremium: userInfo.value?.getIsPremium(),
		rating: userInfo.value?.getRating(),
		personastate: userInfo.value?.getCurrentStatus(),
		rol: userInfo.value?.getRol(),
		steamid: userInfo.value?.getSteamId(),
		colorChat: userInfo.value?.getColorChat(),
		glowColor: userInfo.value?.getGlowColor(),
		avatarfull: userInfo.value?.getAvatarFull(),
		personaname: userInfo.value?.getPersonaName(),
		timecreted: userInfo.value?.getTimeCreated(),
		message_body: chatText.value,
		room: props.gameType,
		created_at: Math.floor(Date.now() / 1000),
	};

	chatService.sendMessage(message, props.gameType);

	chatText.value = "";
};

//Insert Emoji
const insertEmoji = (emoji: any) => {
	chatText.value += emoji.i;
};

const scrollToBottom = () => {
	nextTick(() => {
		const lastMessage = messageContainer.value?.querySelector(".v-list-item:last-child");
		if (lastMessage) {
			lastMessage.scrollIntoView({
				behavior: "smooth",
				block: "end",
			});
		}
	});
};

watch(chatText, () => {
	if (chatText.value != "") {
		socketInstance.emit("user:typing", {
			user: userInfo.value?.getPersonaName(),
			room: props.gameType,
		});
	}
});

//Get Messages
const getMessages = async () => {
	chatService
		.getRoomMessages(props.gameType)
		.then((response: IChat[]) => {
			messageList.value = new ChatModel(response);
			isLoading.value = false;
			scrollToBottom();
		})
		.catch((err) => {
			console.log(err);
		});
};

const socketEvents = () => {
	socketInstance.on("chat:handle-recieve-message", (message: ChatItemModel) => {
		const messageConstructor = new ChatItemModel(message);

		messageList.value?.getChats().push(messageConstructor);

		if (chatText.value == "") userTyping.value = "";

		userTyping.value = "";
		scrollToBottom();
	});

	socketInstance.on("delete:message:admin", (chatid: number) => {
		let removeIndex = messageList.value
			?.getChats()
			.map((item: ChatItemModel) => {
				return item.getChatId();
			})
			.indexOf(chatid);

		if (removeIndex !== -1) messageList.value?.getChats().splice(removeIndex!, 1);
	});

	socketInstance.on("chat:user-typing", (userName: string) => {
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
