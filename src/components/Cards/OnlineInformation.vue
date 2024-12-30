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
				<!-- <v-col
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
				</v-col> -->
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
import useEmitter from "@/composables/useEmitter";

const userStore = useUserStore();

const emitter = useEmitter();

const socket = useSocket();

const userInfo = computed<PlayerItemModel | null>(() => userStore.userInfo as PlayerItemModel | null);

const onlinePlayers = ref<InformationItemModel | null>(null);

const handleSocketEvents = () => {
	socket.on("user:connect", (rol: number) => {
		if (rol == 1 || rol == 3) onlinePlayers.value?.setOnlineUsers();

		if (rol == 2) onlinePlayers.value?.setOnlineAdmins();
	});

	socket.on("disconnect:user", (userInfo: IPlayer) => {
		if (userInfo.Rol == 1 || userInfo.Rol == 3) onlinePlayers.value?.removeOnlineUsers();

		if (userInfo.Rol == 2) onlinePlayers.value?.removeOnlineAdmins();
	});
};

const getOnlineUsers = () => {
	playerService
		.getOnlineUsers()
		.then((response) => {
			onlinePlayers.value = new InformationItemModel(response.data.data);
		})
		.catch((err) => {
			emitter.emit("alert", err.response.data);
		});
};

onMounted(() => {
	handleSocketEvents();
	getOnlineUsers();
});
</script>
