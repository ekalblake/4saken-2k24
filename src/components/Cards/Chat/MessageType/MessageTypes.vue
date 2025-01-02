<template>
	<v-slide-y-reverse-transition v-if="message">
		<v-list-item>
			<template v-slot:prepend>
				<v-tooltip :text="helpers.unixToDate(message.getCreatedAt())">
					<template v-slot:activator="{ props }">
						<v-avatar
							v-bind="props"
							size="30"
							@click="openProfile(message.getProfileURL())"
							class="rounded-lg cursor-pointer align-self-start"
							:style="message.getColorStyle()"
						>
							<v-img :src="message.getAvatarFull()" />
						</v-avatar>
					</template>
				</v-tooltip>
			</template>
			<template v-slot:default>
				<component :message="message" :is="getComponent(message.getMessageType())"> </component>
			</template>
			<!-- <template v-if="message.getPersonaName() == userInfo?.getPersonaName()" v-slot:append>
				<div class="d-flex align-start">
					<v-avatar
						size="30"
						@click="openProfile(message.getProfileURL())"
						class="rounded-lg cursor-pointer align-self-start"
						:style="message.getColorStyle()"
					>
						<v-img :src="message.getAvatarFull()" />
					</v-avatar>
				</div>
			</template> -->
		</v-list-item>
	</v-slide-y-reverse-transition>
</template>
<script setup lang="ts">
import { computed } from "vue";

import TextType from "@/components/Cards/Chat/MessageType/TextType.vue";
import AudioType from "@/components/Cards/Chat/MessageType/AudioType.vue";
import ReplyToType from "@/components/Cards/Chat/MessageType/ReplyToType.vue";
import ImageType from "@/components/Cards/Chat/MessageType/ImageType.vue";
import ChatItemModel from "@/models/Chat/ChatItemModel";
import { useUserStore } from "@/store/userStore";
import PlayerItemModel from "@/models/Player/PlayerItemModel";
import helpers from "@/utils/Dateformat";

const props = defineProps<{
	message: ChatItemModel | null;
}>();

const getComponent = (type: IMessageType) => {
	switch (type) {
		case "TEXT":
			return TextType;
		case "REPLY_TO":
			return ReplyToType;
		case "IMAGE":
			return ImageType;
		case "AUDIO":
			return AudioType;
		default:
			return TextType;
	}
};

const userStore = useUserStore();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const openProfile = (link: string) => {
	window.open(link);
};
</script>
