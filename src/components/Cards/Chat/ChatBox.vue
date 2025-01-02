<template>
	<v-card class="bgc_cards text-white overflow-auto" max-height="555" width="750" height="auto">
		<div v-if="isLoading" class="progressbar_center">
			<v-progress-circular indeterminate color="primary" />
		</div>
		<template v-else>
			<div ref="messageContainer">
				<v-list v-if="messageList" class="bg-transparent">
					<template v-for="(message, i) of messageList?.getChats()" :key="i">
						<MessageTypes :message="message" />
					</template>
				</v-list>
			</div>
		</template>
	</v-card>
	<v-card class="bgc_cards text-white overflow-auto my-3" max-height="250" width="750">
		<v-card-actions>
			<InputChat :game-type="gameType" />
		</v-card-actions>
	</v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick } from "vue";

import "vue3-emoji-picker/css";

import MessageTypes from "./MessageType/MessageTypes.vue";

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";

import ChatModel from "@/models/Chat/ChatModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import { chatService } from "@/services/Chat/ChatService";
import useEmitter from "@/composables/useEmitter";
import InputChat from "@/components/Cards/Chat/InputChat.vue";

const props = defineProps<{
	gameType: number;
}>();

const emitter = useEmitter();

const socketInstance = useSocket();

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const isLoading = ref<boolean>(true);

const messageList = ref<ChatModel | null>(null);

const messageContainer = ref<HTMLElement | null>(null);

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

		scrollToBottom();
	});

	socketInstance.on("admin:delete-message", (chatid: number) => {
		messageList.value?.removeMessage(chatid);
	});
};

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
