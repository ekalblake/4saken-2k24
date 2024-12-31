<template>
	<v-card class="bgc_cards text-white overflow-auto" max-height="555" width="750" height="auto">
		<div v-if="isLoading" class="progressbar_center">
			<v-progress-circular indeterminate color="primary" />
		</div>
		<template v-else>
			<div ref="messageContainer">
				<v-list v-if="messageList" class="bg-transparent">
					<v-list-item v-for="(message, i) of messageList?.getChats()" :key="i">
						<template v-slot:prepend>
							<v-avatar
								size="30"
								@click="openProfile(message.getProfileURL())"
								class="rounded-lg cursor-pointer"
								:style="message.getColorStyle()"
							>
								<v-img :src="message.getAvatarFull()" />
							</v-avatar>
						</template>
						<template v-slot:default>
							<span class="overflow-auto" :style="message.getColorChatStyle()">
								{{ message.getPersonaName() }} </span
							>:
							<span v-if="userInfo?.getIsSupporting()" :style="message.getIsSupportStyle()">
								{{ message.getMessageChat() }}
							</span>
							<span v-else>
								{{ message.getMessageChat() }}
							</span>
						</template>
					</v-list-item>
				</v-list>
			</div>
		</template>
	</v-card>
	<v-card class="bgc_cards text-white overflow-auto my-3" max-height="250" width="750">
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
					<v-btn class="rounded-lg" variant="plain" size="x-small" icon="mdi-send" @click="addMessage">
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
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import { chatService } from "@/services/Chat/ChatService";
import useEmitter from "@/composables/useEmitter";

const props = defineProps<{
	gameType: number;
}>();

const emitter = useEmitter();

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
	if (!chatText.value || !userInfo.value) return;

	const message: IChatMessage = {
		message_body: chatText.value,
	};

	chatService
		.sendMessage(message, props.gameType)
		.then((response) => {
			socketInstance.emit("chat:handle-send-message", {
				message: response.data.data,
				room: props.gameType,
			});
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});

	chatText.value = "";
};

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

const getMessages = async () => {
	chatService
		.getRoomMessages(props.gameType)
		.then((response) => {
			messageList.value = new ChatModel(response.data.data);
			isLoading.value = false;
			scrollToBottom();
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

const socketEvents = () => {
	socketInstance.on("chat:handle-recieve-message", (message: IChat) => {
		messageList.value?.addMessage(message);

		if (chatText.value == "") userTyping.value = "";

		userTyping.value = "";
		scrollToBottom();
	});

	socketInstance.on("admin:delete-message", (chatid: number) => {
		messageList.value?.removeMessage(chatid);
	});

	socketInstance.on("chat:user-typing", (userName: string) => {
		if (chatText.value == "") {
			userTyping.value = "";
		} else {
			userTyping.value = userName + " está escribiendo..";
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
