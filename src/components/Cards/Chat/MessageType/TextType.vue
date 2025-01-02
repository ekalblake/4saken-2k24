<template>
	<!-- <span class="overflow-auto" :style="message.getColorChatStyle()"> {{ message.getPersonaName() }}: </span> -->
	<span v-if="userInfo?.getIsSupporting()" :style="message.getIsSupportStyle()">
		{{ message.getMessageData() }}
	</span>
	<span v-else>
		{{ message.getMessageChat() || message.getMessageData().text }}
	</span>
</template>
<script setup lang="ts">
import ChatItemModel from "@/models/Chat/ChatItemModel";
import { useUserStore } from "@/store/userStore";
import { computed } from "vue";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const props = defineProps<{
	message: ChatItemModel;
}>();
</script>
