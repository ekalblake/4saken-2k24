<template>
	<v-card class="mx-4" height="auto">
		<v-card-text class="pa-0">
			<audio style="min-width: 350px; width: 100%; height: 40px" controls :src="imageUrl"></audio>
		</v-card-text>
	</v-card>
</template>
<script setup lang="ts">
import { API_URL } from "@/constants/constants";
import ChatItemModel from "@/models/Chat/ChatItemModel";
import { useUserStore } from "@/store/userStore";
import { computed } from "vue";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const props = defineProps<{
	message: ChatItemModel;
}>();

const imageUrl = computed(
	() => `${API_URL}/${props.message.getMessageData().destination}${props.message.getMessageData().filename}`,
);
</script>
