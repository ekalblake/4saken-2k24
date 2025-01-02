<template>
	<div class="d-flex mx-3">
		<v-img
			@click="toggleView"
			cover
			class="cursor-pointer rounded-lg"
			:src="imageUrl"
			height="150px"
			width="auto"
			style="object-fit: cover"
		></v-img>
	</div>
</template>
<script setup lang="ts">
import { computed } from "vue";

import ChatItemModel from "@/models/Chat/ChatItemModel";

import { useUserStore } from "@/store/userStore";

import useEmitter from "@/composables/useEmitter";

import { API_URL } from "@/constants/constants";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const emitter = useEmitter();

const props = defineProps<{
	message: ChatItemModel;
}>();

const imageUrl = computed(
	() => `${API_URL}/${props.message.getMessageData().destination}${props.message.getMessageData().filename}`,
);

const toggleView = () => {
	const dataInfo = {
		type: "IMAGE",
		src: imageUrl,
	};
	emitter.emit("open-view-detail", dataInfo);
};
</script>
