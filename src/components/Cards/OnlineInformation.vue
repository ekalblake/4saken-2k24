<template>
	<v-card class="text-white bgc_cards">
		<v-card-text class="d-flex font-weight-bold">
			<v-row>
				<v-col
					:md="userInfo?.getIsSupporting() ? '3' : '8'"
					:cols="userInfo?.getIsSupporting() ? '4' : '8'"
					class="align-self-center"
				>
					<v-icon>mdi-account</v-icon>
					<span class="mx-4">{{ onlinePlayers?.getOnlineUser() || "..." }}</span>
					<v-icon>mdi-account-cog</v-icon>
					<span class="mx-4">{{ onlinePlayers?.getOnlineAdmins() || "..." }}</span>
				</v-col>
				<v-col
					v-if="userInfo?.getIsSupporting()"
					:md="userInfo ? '5' : '5'"
					:cols="userInfo ? '4' : '4'"
					class="align-self-center"
				>
					<p>Estás apoyando a 4SAKEN.US, ganas mejoras!</p>
				</v-col>
				<v-col
					:md="userInfo?.getIsSupporting() ? '2' : '2'"
					:cols="userInfo?.getIsSupporting() ? '3' : '3'"
					:offset-md="userInfo?.getIsSupporting() ? '1' : '2'"
					:offset="userInfo?.getIsSupporting() ? '1' : '1'"
					class="d-flex justify-end ga-2"
				>
					<v-avatar class="cursor-pointer" @click="openLink('https://discord.gg/GFasRy4wd4')" size="50">
						<v-img width="auto" src="src/assets/social/discord.png"></v-img>
					</v-avatar>
					<v-avatar
						class="cursor-pointer"
						@click="openLink('https://steamcommunity.com/groups/4sakenus')"
						size="50"
					>
						<v-img width="auto" src="src/assets/social/steam.png"></v-img>
					</v-avatar>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { playerService } from "@/services/Player/PlayerService";
import InformationItemModel from "@/models/Player/InformationItemModel";
import PlayerItemModel from "@/models/Player/PlayerItemModel";

import useSocket from "@/composables/useSocket";

import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();

const socket = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const onlinePlayers = ref<InformationItemModel | null>(null);

const openLink = (link: string) => {
	window.open(link, "_blank");
};

const handleSocketEvents = () => {
	socket.on("user:connect", () => {
		getOnlineUsers();

		if (userInfo.value?.getRol() === 2) onlinePlayers.value?.setOnlineAdmins();
	});

	socket.on("disconnect:user", () => {
		getOnlineUsers();

		if (userInfo.value?.getRol() === 2) onlinePlayers.value?.removeOnlineAdmins();
	});
};

const getOnlineUsers = () => {
	playerService
		.getOnlineUsers()
		.then((response) => {
			onlinePlayers.value = new InformationItemModel(response);
		})
		.catch((err) => {
			console.log(err);
		});
};

onMounted(() => {
	handleSocketEvents();
	getOnlineUsers();
});
</script>
