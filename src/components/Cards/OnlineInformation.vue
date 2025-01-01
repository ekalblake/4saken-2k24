<template>
	<v-card :style="userInfo?.getBoxShadow()" class="text-white bgc_cards">
		<v-card-text class="d-flex font-weight-bold">
			<v-row v-if="!onlinePlayers">
				<v-col cols="12">
					<v-icon>mdi-account</v-icon>
					<v-progress-circular class="mx-3" size="15" indeterminate color="primary" />
					<v-icon>mdi-account-cog</v-icon>
					<v-progress-circular class="mx-3" size="15" indeterminate color="primary" />
				</v-col>
			</v-row>
			<v-row v-else>
				<v-col
					:md="userInfo?.getIsSupporting() ? '3' : '8'"
					:cols="userInfo?.getIsSupporting() ? '4' : '8'"
					class="align-self-center"
				>
					<v-icon>mdi-account</v-icon>
					<span class="mx-4">{{ onlinePlayers.getOnlineUser() }}</span>
					<v-icon>mdi-account-cog</v-icon>
					<span class="mx-4">{{ onlinePlayers.getOnlineAdmins() }}</span>
				</v-col>
				<v-col
					v-if="userInfo?.getIsSupporting()"
					:md="userInfo ? '5' : '5'"
					:cols="userInfo ? '4' : '4'"
					class="align-self-center"
				>
					<p>Estás apoyando a 4SAKEN.US, ganas mejoras!</p>
				</v-col>
				<v-col offset="3">
					<v-slider :value="currentVolume" @end="updateVolume" color="white" hide-details> </v-slider>
				</v-col>
				<!-- <v-col
					:md="userInfo?.getIsSupporting() ? '2' : '2'"
					:cols="userInfo?.getIsSupporting() ? '3' : '3'"
					:offset-md="userInfo?.getIsSupporting() ? '1' : '2'"
					:offset="userInfo?.getIsSupporting() ? '1' : '1'"
					class="d-flex justify-end ga-2"
				>
					<v-avatar class="cursor-pointer" @click="openLink('https://discord.gg/GFasRy4wd4')" size="50">
						<v-img width="auto" src="@/assets/social/discord.png"></v-img>
					</v-avatar>
					<v-avatar
						class="cursor-pointer"
						@click="openLink('https://steamcommunity.com/groups/4sakenus')"
						size="50"
					>
						<v-img width="auto" src="@/assets/social/steam.png"></v-img>
					</v-avatar>
				</v-col> -->
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import InformationItemModel from "@/models/Player/InformationItemModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const socket = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const currentVolume = computed(() => userStore.audio);

const updateVolume = (event: number) => {
	const scaledVolume = (event * (1 - 0.1)) / (100 - 0) + 0.1;

	userStore.updateVolume(scaledVolume);

	const audio = new Audio("/assets/audio/helpful_event_1.wav");

	audio.volume = scaledVolume;

	audio.play();
};

const onlinePlayers = computed<InformationItemModel | null>(
	() => userStore.onlineInformation as InformationItemModel | null,
);

const handleSocketEvents = () => {
	socket.on("user:connect", (rol: number) => {
		userStore.userConnect(rol);
	});

	socket.on("disconnect:user", (userInfo: IPlayer) => {
		userStore.usersDisconnect(userInfo);
	});
};

onMounted(() => {
	handleSocketEvents();
});
</script>
